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

const addLike = (req, res) => {
  const { bookId } = req.params;

  let authorization = ensureAuthorization(req);

  let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  let values = [authorization.id, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const removeLike = (req, res) => {
  const { bookId } = req.params;

  let decodedJwt = ensureAuthorization(req);

  let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
  let values = [decodedJwt.id, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.NO_CONTENT).end();
  });
};

module.exports = { addLike, removeLike };
