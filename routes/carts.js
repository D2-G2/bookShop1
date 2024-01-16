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

router.post('/', addCartItem);

router.get('/', getCartItems);

router.delete('/:cartItemId', deleteCartItem);

module.exports = router;
