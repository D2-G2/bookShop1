const express = require('express');
const { allBooks, bookDetail, categoryBooks } = require('../controller/bookController');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    return allBooks(req, res);
  } else categoryBooks(req, res);
});

router.get('/:id', bookDetail);

module.exports = router;

/**
 * @swagger
 * paths:
 *  /:
 *   get:
 *    tags: [books]
 *    summary: 도서 목록 조회
 *    requestBody:
 *      description: 도서 목록 조회
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      200:
 *       description: 도서 목록 조회 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *  /:id:
 *   get:
 *    tags: [books]
 *    summary: 개별 도서 목록 조회
 *    requestBody:
 *      description: 회원가입
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      201:
 *       description: 개별 도서 목록 조회 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 */
