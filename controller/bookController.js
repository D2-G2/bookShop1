const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const handleDatabaseError = (err, res) => {
  console.log(err);
  return res.status(StatusCodes.BAD_REQUEST).end();
};

const allBooks = (req, res) => {
  let { limit, currentPage, news, categoryId } = req.query;

  limit = parseInt(limit);
  let offset = (currentPage - 1) * limit;

  let sql = 'SELECT * FROM books';
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
    if (err) return handleDatabaseError(err, res);
    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const { id } = req.params;

  let sql = `SELECT * FROM books 
              LEFT JOIN category ON books.category_id = category.id
              WHERE books.id = ?`;

  conn.query(sql, id, (err, results) => {
    if (err) return handleDatabaseError(err, res);
    if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};
