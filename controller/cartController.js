const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
  let receivedJwt = req.headers['authorization'];

  let authorization = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  return authorization;
};

const addCartItem = (req, res) => {
  const { bookId, quantity } = req.body;

  let authorization = ensureAuthorization(req);

  let values = [authorization.id, bookId, quantity];
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
  const { selected } = req.body;
  let authorization = ensureAuthorization(req);
  const values = [authorization.id, selected];

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
              FROM cartItems 
              LEFT JOIN books
              ON cartItems.book_id = books.id
              WHERE user_id = ? AND cartItems.id IN (?)`;
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const deleteCartItem = (req, res) => {
  const { cartItemId } = req.params;

  let sql = `DELETE FROM cartItems WHERE id = ?`;
  conn.query(sql, [cartItemId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addCartItem, getCartItems, deleteCartItem };
