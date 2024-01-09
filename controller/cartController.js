const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addCartItem = (req, res) => {
  const { bookId, quantity, userId } = req.body;

  let values = [userId, bookId, quantity];
  let sql = 'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)';
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const getCartItems = (req, res) => {
  const { userId, selected } = req.body;
  const values = [userId, selected];

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
              FROM cartItems 
              LEFT JOIN books
              ON cartItems.book_id = books.id
              WHERE user_id = ? AND cartItemds.id IN (?)`;
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const deleteCartItem = (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  const values = [userId, bookId];

  let sql = 'DELETE FROM cartItems WHERE userId = ? AND bookId = ?';
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.NO_CONTENT).end();
  });
};

module.exports = { addCartItem, getCartItems, deleteCartItem };
