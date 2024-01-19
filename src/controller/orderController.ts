import mariadb, { OkPacket, RowDataPacket } from 'mysql2/promise';
import ensureAuthorization from '../auth/auth';
import StatusCodes from 'http-status-codes';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { OrderRequestBody } from '../types/orders.types';

const order = async (req: Request, res: Response) => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
  });

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
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body as OrderRequestBody;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';

    let [results] = (await conn.execute(sql, values)) as OkPacket[];

    const delivery_id = results.insertId;
    values = [firstBookTitle, authorization.id, delivery_id, totalQuantity, totalPrice];
    sql = 'INSERT INTO orders (book_title, user_id, delivery_id, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)';

    [results] = (await conn.execute(sql, values)) as OkPacket[];
    const orderId = results.insertId;

    sql = 'SELECT book_id, quantity FROM cartItems WHERE id IN (?)';
    let [orderItems] = (await conn.query(sql, [items])) as RowDataPacket[];

    values = orderItems.map((item: RowDataPacket) => [orderId, item.book_id, item.quantity]);
    sql = 'INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?';

    [results] = (await conn.query(sql, [values])) as OkPacket[];

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(results);
  }
};

const deleteCartItems = async (conn: mariadb.Connection, items: string[]) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  return result;
};

const getOrderDetail = async (req: Request, res: Response) => {
  let authorization = ensureAuthorization(req);

  if (authorization instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  } else if (authorization instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  } else {
    const { orderId } = req.params;
    const conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Bookshop',
      dateStrings: true,
    });

    let sql = `SELECT book_id, title, author, price, quantity
    FROM orderedBook
    LEFT JOIN books
    ON orderedBook.book_id = books.id
    WHERE order_id = ?`;
    let [rows] = (await conn.query(sql, orderId)) as RowDataPacket[];
    rows = rows.map((row: RowDataPacket) => {
      const { book_id, ...rest } = row;
      return {
        ...rest,
        bookId: book_id,
      };
    });
    return res.status(StatusCodes.OK).json(rows);
  }
};
const getOrders = async (req: Request, res: Response) => {
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
    const conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Bookshop',
      dateStrings: true,
    });
    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id = delivery.id`;
    let [rows] = (await conn.query(sql)) as RowDataPacket[];
    rows = rows.map((row: RowDataPacket) => {
      const { created_at, book_title, total_quantity, total_price, ...rest } = row;
      return {
        ...rest,
        createdAt: created_at,
        bookTitle: book_title,
        totalQuantity: total_quantity,
        totalPrice: total_price,
      };
    });
    return res.status(StatusCodes.OK).json(rows);
  }
};
export { order, getOrders, getOrderDetail };
