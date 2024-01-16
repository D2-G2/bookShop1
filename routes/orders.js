const express = require('express');
const { getOrders, order, getOrderDetail } = require('../controller/orderController');
const router = express.Router();

router.use(express.json());

router.post('/', order);

router.get('/', getOrders);

router.get('/:orderId', getOrderDetail);

module.exports = router;
