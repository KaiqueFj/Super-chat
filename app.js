const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const useRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/AppError');
const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.engine('jade', require('pug').__express);
app.use(express.static(path.join(`${__dirname}/public`)));

//Routes
app.use('/', viewRouter);
app.use('/api/v1/users', useRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can´t find ${req.originalUrl} on this server !`, 404));
});

module.exports = app;
