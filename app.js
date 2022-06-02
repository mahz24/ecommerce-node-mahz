const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const { errorHandler } = require('./controllers/error.controller');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './config.env' });

//Routers
const { userRouter } = require('./routes/user.route');
const { productRouter } = require('./routes/product.route');
const { cartRouter } = require('./routes/cart.route');

const app = express();

//Entablish incoming JSON data
app.use(express.json());

app.use(cors());

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 1000,
  message: 'Too many requests from this IP',
});

app.use(limiter);

//Endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);

//Errors handlers
app.use('*', errorHandler);

module.exports = { app };
