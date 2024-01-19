import express from 'express';
import { getOrders, order, getOrderDetail } from '../controller/orderController';

const router = express.Router();

router.use(express.json());

router.post('/', order);

router.get('/', getOrders);

router.get('/:orderId', getOrderDetail);

export default router;
