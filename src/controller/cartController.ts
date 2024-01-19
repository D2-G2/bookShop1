import conn from '../db/mariadb';
import ensureAuthorization from '../auth/auth';
import StatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

const addCartItem = (req: Request, res: Response) => {
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
    const { bookId, quantity } = req.body;
    let values = [authorization.id, bookId, quantity];
    let sql = 'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)';
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(results);
    });
  }
};
const getCartItems = (req: Request, res: Response) => {
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
    const { selected } = req.body;
    const values = [authorization.id];

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
    FROM cartItems 
    LEFT JOIN books
    ON cartItems.book_id = books.id
    WHERE user_id = ?`;
    if (selected) {
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }
    conn.query(sql, values, (err, results: RowDataPacket[]) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length) {
        results.map((result) => {
          result.bookId = result.book_id;
          delete result.book_id;
        });
      }
      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const deleteCartItem = (req: Request, res: Response) => {
  let authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  } else {
    const { cartItemId } = req.params;
    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, [cartItemId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json(results);
    });
  }
};
export { addCartItem, getCartItems, deleteCartItem };
