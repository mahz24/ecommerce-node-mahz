const express = require('express');
const { errorHandler } = require('./controllers/error.controller');

const app = express();

//Entablish incoming JSON data
app.use(express.json());

//Errors handlers
app.use('*', errorHandler);

module.exports = { app };
