const express = require('express');
const { getOrders, order, getOrderDetail } = require('../controller/orderController');
const router = express.Router();

router.use(express.json());

router.post('/', order);

router.get('/', getOrders);

router.get('/:id', getOrderDetail);

module.exports = router;
