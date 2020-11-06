const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

const router = express.Router();
const authController = require('../controllers/user.controller');

router.post('/login', asyncHandler(authController.login));

router.post('/register', asyncHandler(authController.register));

router.get('/me', passport.authenticate('jwt', { session: false }), asyncHandler(authController.getCurrentUser));

router.put('/me', passport.authenticate('jwt', { session: false }), asyncHandler(authController.updateCurrentUser));

router.delete('/me', passport.authenticate('jwt', { session: false }), asyncHandler(authController.deleteCurrentUser));

module.exports = router;
