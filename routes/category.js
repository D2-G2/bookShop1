const express = require('express');
const router = express.Router();
const { allCategory } = require('../controller/categoryController');

router.use(express.json());
router.get('/', allCategory);

module.exports = router;

/**
 * @swagger
 * paths:
 *  /:
 *   get:
 *    tags: [category]
 *    summary: 카테고리 전체 조회
 *    requestBody:
 *      description: 카테고리 전체 조회
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      200:
 *       description: 카테고리 전체 조회 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 */
