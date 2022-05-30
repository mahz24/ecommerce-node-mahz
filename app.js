const express = require('express');
const { errorHandler } = require('./controllers/error.controller');

//Routers
const { userRouter } = require('./routes/user.route');
const { productRouter } = require('./routes/product.route');

const app = express();

//Entablish incoming JSON data
app.use(express.json());

//Endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

//Errors handlers
app.use('*', errorHandler);

module.exports = { app };
