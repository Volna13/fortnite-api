const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const { regSchema, loginSchema } = require('../utils/userValidationSchema');
const UnprocessableEntity = require('../errors/unprocessableEntity');
const ApplicationError = require('../errors/applicationError');
const NotFoundError = require('../errors/notFounterror');

const { SALT, JWTSECRET } = require('../config/key.config');

exports.login = async (req, res) => {
  await validateLoginUser(req);
  await loginUser(req, res, req.body.email, req.body.password);
};

async function validateLoginUser(req) {
  try {
    await loginSchema.validateAsync(req.body);
  } catch (e) {
    const field = e.details[0].context.label;
    throw new UnprocessableEntity(field, e);
  }
}

async function loginUser(req, res, email, password) {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const pwdResult = bcrypt.compareSync(password, user.password);
    if (pwdResult) {
      await authUser(req, res, user);
    } else {
      throw new UnprocessableEntity('Password', 'Password do not match');
    }
  } else {
    throw new NotFoundError();
  }
}

async function authUser(req, res, user) {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWTSECRET,
    { expiresIn: 60 * 60 },
  );

  res.status(200).json({
    token: `Bearer ${token}`,
  });
}

exports.register = async (req, res) => {
  await validateCreateUser(req);
  const doesExistUser = await User.findOne({
    $or: [{ email: req.body.email }, { epicNickname: req.body.epicNickname }],
  });

  if (doesExistUser) {
    throw new UnprocessableEntity('email and/or nickname', 'email and/or nickname does exist');
  } else {
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, SALT),
      platform: req.body.platform,
      epicNickname: req.body.epicNickname,
    });

    try {
      await newUser.save();
      res.status(200).json(newUser);
      console.log('User created');
    } catch (e) {
      console.log(e);
      throw new ApplicationError();
    }
  }
};

async function validateCreateUser(req) {
  try {
    await regSchema.validateAsync(req.body);
  } catch (e) {
    const field = e.details[0].context.label;
    throw new UnprocessableEntity(field, e);
  }
}
