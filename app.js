const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const ApplicationError = require('./errors/applicationError');
const UnprocessableEntityError = require('./errors/unprocessableEntity');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth.routes');

const { MONGO_URI } = require('./config/key.config');

const app = express();

mongoose.set('debug', true);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.log('error:', e));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof UnprocessableEntityError) {
    res.status(err.getStatus()).json({
      field: err.getField(),
      message: err.message,
    });
  } else if (err instanceof ApplicationError) {
    res.status(err.getStatus()).send();
  } else {
    res.status(500).send();
  }
});

app.use(function (req, res) {
  res.status(404).json({
    message: 'error 404',
  });
});
module.exports = app;
