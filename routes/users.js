const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { body, validationResult } = require('express-validator');

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
  (req, res) => {
    const { email, password } = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';

    conn.query(sql, [email], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
      let loginUser = results[0];
      if (loginUser && loginUser.password === password) {
        res.status(200).json({
          message: '로그인 성공',
        });
      } else {
        res.status(400).json({
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
      }
    });
  }
);

// 회원가입
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage('email 확인 필요'),
    body('password').isString().notEmpty().withMessage('비밀번호 확인 필요'),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;
    let sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    let values = [email, password];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(results);
    });
  }
);

// 비밀번호 초기화 요청
router.post('/reset', (req, res) => {
  res.send('비밀번호 초기화 요청');
});

// 비밀번호 초기화
router.put('/reset', (req, res) => {
  res.send('비밀번호 초기화');
});

module.exports = router;
