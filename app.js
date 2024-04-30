const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // Import bodyParser module

const useRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/AppError');
const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

module.exports = app;
