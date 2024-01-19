import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { join, login, passwordReset, passwordResetRequest } from '../controller/userController';

const router = express.Router();
router.use(express.json());

const validate = (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    console.log(err);
    return res.status(400).json(err.array());
  }
};

// 로그인
router.post(
  '/login',
  [
    body('email').notEmpty().isEmail().withMessage('email 확인 필요'),
    body('password').isString().notEmpty().withMessage('비밀번호 확인 필요'),
    validate,
  ],
  login
);

// 회원가입
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage('email 확인 필요'),
    body('password').isString().notEmpty().withMessage('비밀번호 확인 필요'),
    validate,
  ],
  join
);

// 비밀번호 초기화 요청
router.post('/reset', passwordResetRequest);

// 비밀번호 초기화
router.put('/reset', passwordReset);

export default router;

/**
 * @swagger
 * paths:
 *  /login:
 *   post:
 *    tags: [user]
 *    summary: 로그인
 *    requestBody:
 *      description: 로그인
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      200:
 *       description: 로그인 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *  /join:
 *   post:
 *    tags: [user]
 *    summary: 회원가입
 *    requestBody:
 *      description: 회원가입
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      201:
 *       description: 회원가입 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *  /reset:
 *   post:
 *    tags: [user]
 *    summary: 비밀번호 초기화 요청
 *    requestBody:
 *      description: 비밀번호 초기화 요청
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      201:
 *       description: 비밀번호 초기화 요청 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *   put:
 *    tags: [user]
 *    summary: 비밀번호 초기화
 *    requestBody:
 *      description: 비밀번호 초기화
 *      required: true
 *      content:
 *        application/json:
 *    responses:
 *      201:
 *       description: 비밀번호 초기화 성공
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 */
