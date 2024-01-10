const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const order = (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;
  let delivery_id;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    delivery_id = results.insertId;
    values = [firstBookTitle, userId, delivery_id, totalQuantity, totalPrice];
    sql = 'INSERT INTO orders (book_title, user_id, delivery_id, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)';

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      const orderId = results.insertId;
      values = items.map((item) => [orderId, item.bookId, item.quantity]);
      sql = 'INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?';

      conn.query(sql, [values], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.CREATED).json(results);
      });
    });
  });
};

const getOrders = (req, res) => {
  const { userId } = req.body;

  let sql = `SELECT orders.id, orderItems.id AS order_item_id, book_id, title, summary, quantity, price 
              FROM orders 
              LEFT JOIN orderItems
              ON orders.id = orderItems.order_id
              LEFT JOIN books
              ON orderItems.book_id = books.id
              WHERE user_id = ?`;
  conn.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getOrderDetail = (req, res) => {
  const { orderId } = req.params;

  let sql = `SELECT orders.id, orderItems.id AS order_item_id, book_id, title, summary, quantity, price 
              FROM orders 
              LEFT JOIN orderItems
              ON orders.id = orderItems.order_id
              LEFT JOIN books
              ON orderItems.book_id = books.id
              WHERE orders.id = ?`;
  conn.query(sql, [orderId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { order, getOrders, getOrderDetail };
