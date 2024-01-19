import express from 'express';
import { addCartItem, getCartItems, deleteCartItem } from '../controller/cartController';

const router = express.Router();

router.use(express.json());

router.post('/', addCartItem);

router.get('/', getCartItems);

router.delete('/:cartItemId', deleteCartItem);

export default router;
