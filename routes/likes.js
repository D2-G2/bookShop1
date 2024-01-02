const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/:bookId', (req, res) => {
  res.send('좋아요 추가');
});

router.delete('/:bookId', (req, res) => {
  res.send('좋아요 삭제');
});

module.exports = router;
