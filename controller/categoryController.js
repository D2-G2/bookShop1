const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) => {
  let sql = 'SELECT * FROM category';

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) {
      results.map((result) => {
        result.categoryId = result.category_id;
        result.categoryName = result.category_name;
        delete result.category_name;
        delete result.category_id;
      });
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategory };
