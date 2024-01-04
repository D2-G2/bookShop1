const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addLike = (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  let values = [userId, bookId];

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
  const { userId } = req.body;

  let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
  let values = [userId, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.NO_CONTENT).end();
  });
};

module.exports = { addLike, removeLike };
