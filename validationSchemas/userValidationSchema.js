const joi = require('joi');

const regSchema = joi.object({
  fullName: joi.string().trim().required(),
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().min(3).max(30).required(),
  platform: joi.string().valid('kbm', 'gamepad', 'touch').trim().required(),
  epicNickname: joi.string().trim().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().min(3).max(30).trim().required(),
});

const putUserSchema = joi
  .object({
    fullName: joi.string().trim(),
    email: joi.string().email().lowercase().trim(),
    currentPassword: joi.string().max(30).empty(''),
    newPassword: joi.string().min(3).max(30),
    platform: joi.string().valid('kbm', 'gamepad', 'touch').trim().required(),
    epicNickname: joi.string().trim().required(),
  })
  .with('currentPassword', ['newPassword']);

module.exports = {
  regSchema,
  putUserSchema,
  loginSchema,
};
