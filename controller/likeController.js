const conn = require('../mariadb');
const { ensureAuthorization } = require('../auth');
const { StatusCodes } = require('http-status-codes');
let jwt = require('jsonwebtoken');

const addLike = (req, res) => {
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
  } else {
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
const removeLike = (req, res) => {
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
  } else {
    let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
    let values = [authorization.id, bookId];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.NO_CONTENT).end();
    });
  }
};
module.exports = { addLike, removeLike };
