import conn from '../db/mariadb';
import StatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

dotenv.config();

const join = (req: Request, res: Response) => {
  const { email, password } = req.body;

  let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';
  // 비밀번호 암호화
  const salt = crypto.randomBytes(10).toString('base64');
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

  let values = [email, hashPassword, salt];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ?';

  conn.query(sql, email, (err, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(400).end();
    }
    let loginUser = results[0];

    const hashpassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

    if (loginUser && loginUser.password === hashpassword) {
      const token = jwt.sign(
        {
          id: loginUser.id,
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY as string,
        {
          expiresIn: '5m',
          issuer: 'munseok',
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
      });

      console.log(token);

      res.status(StatusCodes.OK).json(results);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordResetRequest = (req: Request, res: Response) => {
  const { email } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ?';
  conn.query(sql, email, (err, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({ email: user.email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

  let sql = 'UPDATE users SET password = ?, salt = ? WHERE email = ?';
  let values = [hashPassword, salt, email];

  conn.query(sql, values, (err, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if ('affectedRows' in results && results.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

export { join, login, passwordResetRequest, passwordReset };
