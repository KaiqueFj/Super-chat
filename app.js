const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const useRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./Controllers/errorController');

const app = express();

//implement cors
app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against XSS
app.use(xss());
app.use(compression());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Limit requests from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour',
});
app.use('/api', limiter);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.engine('jade', require('pug').__express);
app.use(express.static(path.join(`${__dirname}/public`)));

app.use('/styles', (req, res, next) => {
  res.setHeader('Content-Type', 'text/css');
  next();
});

//Routes
app.use('/', viewRouter);
app.use('/api/v1/users', useRouter);

app.use(globalErrorHandler);

module.exports = app;
