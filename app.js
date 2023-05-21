const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// dotenv before app in server

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // serving static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//3) Routes
// Mounting Routes
app.use(`/api/v1/tours`, tourRouter);
app.use(`/api/v1/users`, userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant' find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
