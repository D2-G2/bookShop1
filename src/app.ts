import express from 'express';
import dotenv from 'dotenv';
import { swaggerUi, specs } from './modules/swagger';
import userRouter from './routes/users';
import bookRouter from './routes/books';
import likeRouter from './routes/likes';
import orderRouter from './routes/orders';
import cartRouter from './routes/carts';
import categoryRouter from './routes/category';

const app = express();
dotenv.config();

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);
app.use('/carts', cartRouter);
app.use('/category', categoryRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
