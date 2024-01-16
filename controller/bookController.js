const conn = require('../mariadb');
const { ensureAuthorization } = require('../auth');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const handleDatabaseError = (err, res) => {
  console.log(err);
  return res.status(StatusCodes.BAD_REQUEST).end();
};

const allBooks = (req, res) => {
  let allBooksRes = {};
  let { limit, currentPage, news, categoryId } = req.query;

  limit = parseInt(limit);
  let offset = (currentPage - 1) * limit;

  let sql =
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books';
  let values = [];

  if (categoryId && news) {
    sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values = [...values, categoryId];
  } else if (categoryId) {
    sql += ' WHERE category_id = ?';
    values = [...values, categoryId];
  } else if (news) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ?, ?';
  values = [...values, offset, limit];

  conn.query(sql, values, (err, results) => {
    if (err) console.log(err);
    console.log(results);
    if (results.length) allBooksRes.books = results;
    else return res.status(StatusCodes.NOT_FOUND).end();
  });

  sql = 'SELECT found_rows()';
  conn.query(sql, (err, results) => {
    if (err) return handleDatabaseError(err, res);

    let pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = results[0]['found_rows()'];

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const bookDetail = (req, res) => {
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
  } else if (authorization instanceof ReferenceError) {
    const values = [bookId];
    let sql = `SELECT *, 
    (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes
    FROM books
    LEFT JOIN category ON books.category_id = category.category_id WHERE books.id=?;`;
    conn.query(sql, values, (err, results) => {
      if (err) return handleDatabaseError(err, res);
      if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    const values = [authorization.id, bookId, bookId];
    let sql = `SELECT *, 
  (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes,
  (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
  FROM books
  LEFT JOIN category ON books.category_id = category.category_id WHERE books.id=?;`;

    conn.query(sql, values, (err, results) => {
      if (err) return handleDatabaseError(err, res);
      if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  }
};
module.exports = {
  allBooks,
  bookDetail,
};
