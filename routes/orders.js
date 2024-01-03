const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
  res.send('주문하기');
});

router.get('/', (req, res) => {
  res.send('주문 목록 조회');
});

router.get('/:id', (req, res) => {
  res.json('주문 상세 조회');
});

module.exports = router;

