const express = require('express');
const path = require('path');
const useRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json({ limit: '10kb' }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.engine('jade', require('pug').__express);
app.get('/', function (req, res) {
  res.render('overview');
});

//Routes
app.use('/api/v1/users', useRouter);

app.use(express.static(path.join(`${__dirname}/public`)));

module.exports = app;
