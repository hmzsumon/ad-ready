const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const morgan = require('morgan');

const app = express();

// config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'backend/config/config.env' });
}

// app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require('./routes/userRoute');
const admin = require('./routes/adminRoute');
const deposit = require('./routes/depositRoute');
const withdraw = require('./routes/withdrawRoute');
const payMethod = require('./routes/payMethodRoute');
const dailyWork = require('./routes/dailyWorkRoute');

app.use('/api/v1', user);
app.use('/api/v1', admin);
app.use('/api/v1', deposit);
app.use('/api/v1', withdraw);
app.use('/api/v1', payMethod);
app.use('/api/v1', dailyWork);

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
  });
}

// error middleware
app.use(errorMiddleware);

module.exports = app;
