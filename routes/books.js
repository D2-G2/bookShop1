const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  res.send('도서 목록 조회');
});

router.get('/:id', (req, res) => {
  res.send('도서 조회');
});

router.get('/books', (req, res) => {
  res.json('카테고리별 도서 목록 조회');
});

module.exports = router;
