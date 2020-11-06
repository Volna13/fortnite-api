const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const UserStat = require('../models/userStat.model');

const { regSchema, loginSchema, putUserSchema } = require('../validationSchemas/userValidationSchema');

const UnprocessableEntity = require('../errors/unprocessableEntity');
const ApplicationError = require('../errors/applicationError');
const NotFoundError = require('../errors/notFounterror');
const UnauthorizedError = require('../errors/unauthorizedError');

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

    const newUserStat = new UserStat({
      userId: newUser._id,
      stat: null,
    });

    try {
      await newUser.save();
      await newUserStat.save();
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

exports.getCurrentUser = async (req, res) => {
  const id = req.user._id;
  const currentUser = await User.findById(id);
  if (!currentUser) {
    throw new UnauthorizedError();
  } else {
    res.status(200).json({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      platform: currentUser.platform,
      epicNickname: currentUser.epicNickname,
    });
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  await validateUpdateUser(req);
  const id = req.user._id;
  const currentUser = await User.findById(id);
  const newUserData = await createNewUserData(req, res, next, currentUser, SALT);

  try {
    const updateUser = await User.findOneAndUpdate(id, newUserData);
    if (updateUser) {
      res.status(200).json({
        id,
        fullName: newUserData.fullName || currentUser.fullName,
        email: newUserData.email || currentUser.email,
        platform: newUserData.platform || currentUser.platform,
        epicNickname: newUserData.epicNickname || currentUser.epicNickname,
      });
    }
  } catch (e) {
    throw new ApplicationError(500);
  }
};

async function validateUpdateUser(req) {
  try {
    await putUserSchema.validateAsync(req.body);
  } catch (e) {
    const field = e.details[0].context.label;
    throw new UnprocessableEntity(field, e);
  }
}

async function createNewUserData(req, res, next, currentUser, salt) {
  const newUserData = {};
  Object.keys(req.body).forEach((el) => {
    newUserData[el] = ['fullName', 'email', 'platform', 'epicNickname', 'currentPassword', 'newPassword'].includes(el)
      ? req.body[el]
      : null;
  });
  if (newUserData.currentPassword || newUserData.currentPassword) {
    if (bcrypt.compareSync(req.body.currentPassword, currentUser.password)) {
      newUserData.newPassword = bcrypt.hashSync(req.body.newPassword, salt);
    } else {
      throw new UnprocessableEntity('Current Password', 'Password do not match');
    }
  }
  return newUserData;
}

exports.deleteCurrentUser = async (req, res) => {
  const authUserId = req.user._id;
  try {
    await User.findOneAndDelete(authUserId);
    res.status(200).send();
  } catch (e) {
    throw new ApplicationError();
  }
};
