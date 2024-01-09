const express = require('express');
const {
  addCartItem,
  getCartItems,
  deleteCartItem,
  getSelectedCartItems,
  updateCartItemSelection,
} = require('../controller/cartController');
const router = express.Router();

router.use(express.json());

router.put('/', addCartItem);

router.get('/', getCartItems);

router.delete('/:bookId', deleteCartItem);

module.exports = router;
