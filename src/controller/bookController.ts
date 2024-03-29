import conn from '../db/mariadb';
import ensureAuthorization from '../auth/auth';
import jwt from 'jsonwebtoken';
import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { Pagination } from '../types/books.types';

const handleDatabaseError = (err: Error, res: Response) => {
  console.log(err);
  return res.status(StatusCodes.BAD_REQUEST).end();
};

const allBooks = (req: Request, res: Response) => {
  let allBooksRes: RowDataPacket;
  let { limit, currentPage, news, categoryId } = req.query;

  let parsedLimit = parseInt(limit as string);
  let parsedCurrentPage = parseInt(currentPage as string);
  let offset = (parsedCurrentPage - 1) * parsedLimit;
  let parsedCategoryId = parseInt(categoryId as string);

  let sql =
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books';
  let values: number[] = [];

  if (categoryId && news) {
    sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values = [...values, parsedCategoryId];
  } else if (categoryId) {
    sql += ' WHERE category_id = ?';
    values = [...values, parsedCategoryId];
  } else if (news) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ?, ?';
  values = [...values, offset, parsedLimit];

  conn.query(sql, values, (err, results: RowDataPacket[]) => {
    if (err) console.log(err);
    console.log(results);
    if (Array.isArray(results) && results.length) {
      results.map((result: RowDataPacket) => {
        result.pubDate = result.pub_date;
        delete result.pub_date;
      });
      allBooksRes.books = results;
    } else return res.status(StatusCodes.NOT_FOUND).end();
  });

  sql = 'SELECT found_rows()';
  conn.query(sql, (err, results: RowDataPacket[]) => {
    if (err) return handleDatabaseError(err, res);

    let pagination: Pagination = {
      currentPage: parsedCurrentPage,
      totalCount: results[0]['found_rows()'],
    };

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const bookDetail = (req: Request, res: Response) => {
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
    conn.query(sql, values, (err, results: RowDataPacket[]) => {
      if (err) return handleDatabaseError(err, res);
      if (results[0]) {
        results[0].categoryId = results[0].category_id;
        results[0].pubDate = results[0].pub_date;
        results[0].categoryName = results[0].category_name;
        delete results[0].category_id;
        delete results[0].pub_date;
        delete results[0].category_name;
        return res.status(StatusCodes.OK).json(results[0]);
      } else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else if (authorization instanceof Object) {
    const values = [authorization.id, bookId, bookId];
    let sql = `SELECT *, 
  (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes,
  (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
  FROM books
  LEFT JOIN category ON books.category_id = category.category_id WHERE books.id=?;`;

    conn.query(sql, values, (err, results: RowDataPacket[]) => {
      if (err) return handleDatabaseError(err, res);
      if (results[0]) {
        results[0].categoryId = results[0].category_id;
        results[0].pubDate = results[0].pub_date;
        results[0].categoryName = results[0].category_name;
        delete results[0].category_id;
        delete results[0].pub_date;
        delete results[0].category_name;
        return res.status(StatusCodes.OK).json(results[0]);
      } else return res.status(StatusCodes.NOT_FOUND).end();
    });
  }
};
export { allBooks, bookDetail };
