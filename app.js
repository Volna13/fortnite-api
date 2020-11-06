const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./midllewear/passport');
const ScheduledJobs = require('./Jobs/ScheduledJobs');

const ApplicationError = require('./errors/applicationError');
const UnprocessableEntityError = require('./errors/unprocessableEntity');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user.routes');
const statRouter = require('./routes/stat.routes');

const { MONGO_URI } = require('./config/key.config');

const app = express();

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    const Jobs = new ScheduledJobs();
    Jobs.runJobs();
  } catch (e) {
    console.log(e);
  }
})();

app.use(passport.initialize());
passportConfig(passport);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/stat', statRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof UnprocessableEntityError) {
    console.log('error: ', err);
    res.status(err.getStatus()).json({
      field: err.getField(),
      message: err.message,
    });
  } else if (err instanceof ApplicationError) {
    console.log('error: ', err);
    res.status(err.getStatus()).send();
  } else {
    console.log('error: ', err);
    res.status(500).send();
  }
});

app.use(function (req, res) {
  res.status(404).json({
    message: 'error 404',
  });
});

module.exports = app;
