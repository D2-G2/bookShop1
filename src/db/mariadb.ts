import mariadb, { ConnectionOptions } from 'mysql2';

const connectionOptions: ConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Bookshop',
  dateStrings: true,
};

const connection = mariadb.createConnection(connectionOptions);

export default connection;
