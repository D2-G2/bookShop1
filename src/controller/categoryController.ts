import conn from '../db/mariadb';
import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

const allCategory = (res: Response) => {
  let sql = 'SELECT * FROM category';

  conn.query(sql, (err, results: RowDataPacket[]) => {
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

export default allCategory;
