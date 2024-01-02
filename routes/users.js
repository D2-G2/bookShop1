const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { body, validationResult } = require('express-validator');
const { join, login, passwordReset, passwordResetRequest } = require('../controller/userController');

router.use(express.json());

const validate = (req, res, next) => {
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

module.exports = router;
