const bcrypt = require('bcrypt');

const User = require('../models/users.model');

const { regSchema } = require('../utils/userValidationSchema');
const UnprocessableEntity = require('../errors/unprocessableEntity');
const ApplicationError = require('../errors/applicationError');
const { SALT } = require('../config/key.config');

exports.login = function (req, res) {
  res.send('respond with a resource login');
};

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
