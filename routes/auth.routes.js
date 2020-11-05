const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', asyncHandler(authController.login));

router.post('/register', asyncHandler(authController.register));

module.exports = router;
