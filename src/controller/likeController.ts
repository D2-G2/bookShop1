import conn from '../db/mariadb';
import ensureAuthorization from '../auth/auth';
import StatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const addLike = (req: Request, res: Response) => {
  const { bookId } = req.params;

  let authorization = ensureAuthorization(req);
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  } else if (authorization instanceof Object) {
    let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
    let values = [authorization.id, bookId];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(results);
    });
  }
};
const removeLike = (req: Request, res: Response) => {
  const { bookId } = req.params;

  let authorization = ensureAuthorization(req);
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  } else if (authorization instanceof Object) {
    let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
    let values = [authorization.id, bookId];

    conn.query(sql, values, (err) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.NO_CONTENT).end();
    });
  }
};

export { addLike, removeLike };
