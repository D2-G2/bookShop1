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
