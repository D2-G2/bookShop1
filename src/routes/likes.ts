import express from 'express';
import { addLike, removeLike } from '../controller/likeController';

const router = express.Router();

router.use(express.json());

router.post('/:bookId', addLike);

router.delete('/:bookId', removeLike);

export default router;
