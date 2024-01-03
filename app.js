const express = require('express');
const app = express();
const { swaggerUi, specs } = require('./modules/swagger');
const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const likeRouter = require('./routes/likes');
const orderRouter = require('./routes/orders');
const cartRouter = require('./routes/carts');
const categoryRouter = require('./routes/category');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);
app.use('/carts', cartRouter);
app.use('/category', categoryRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
