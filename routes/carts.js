const express = require('express');
const router = express.Router();

router.use(express.json());

router.put('/', (req, res) => {
  res.send('장바구니 담기');
});

router.get('/', (req, res) => {
  res.send('장바구니 조회');
});

router.delete('/:id', (req, res) => {
  res.send('장바구니 삭제');
});

router.get('/', (req, res) => {
  res.send('장바구니 목록 조회');
});

module.exports = router;
