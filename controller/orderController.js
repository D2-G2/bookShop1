const { ensureAuthorization } = require('../auth');
const jwt = require('jsonwebtoken');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: 'true',
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
  } else {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';

    let [results] = await conn.execute(sql, values);

    const delivery_id = results.insertId;
    values = [firstBookTitle, authorization.id, delivery_id, totalQuantity, totalPrice];
    sql = 'INSERT INTO orders (book_title, user_id, delivery_id, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)';

    [results] = await conn.execute(sql, values);
    const orderId = results.insertId;

    sql = 'SELECT book_id, quantity FROM cartItems WHERE id IN (?)';
    let [orderItems, fields] = await conn.query(sql, [items]);

    values = orderItems.map((item) => [orderId, item.book_id, item.quantity]);
    sql = 'INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?';

    [results] = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(results);
  }
};
const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  return result;
};

const getOrderDetail = async (req, res) => {
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
    const { orderId } = req.params;
    const conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Bookshop',
      dateStrings: 'true',
    });

    let sql = `SELECT book_id, title, author, price, quantity
    FROM orderedBook
    LEFT JOIN books
    ON orderedBook.book_id = books.id
    WHERE order_id = ?`;
    let [rows, fields] = await conn.query(sql, orderId);
    rows = rows.map((row) => {
      const { book_id, ...rest } = row;
      return {
        ...rest,
        bookId: book_id,
      };
    });
    return res.status(StatusCodes.OK).json(rows);
  }
};
const getOrders = async (req, res) => {
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
    const conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Bookshop',
      dateStrings: 'true',
    });
    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id = delivery.id`;
    let [rows, fields] = await conn.query(sql);
    rows = rows.map((row) => {
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
module.exports = { order, getOrders, getOrderDetail };
