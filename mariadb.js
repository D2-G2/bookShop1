const mariadb = require('mysql');

const connection = mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Bookshop',
  dateStrings: 'true',
});

module.exports = connection;
