const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

const router = express.Router();
const fUserStatController = require('../controllers/fUserStat.controller');

router.get('/me', passport.authenticate('jwt', { session: false }), asyncHandler(fUserStatController.getCurrentStat));

module.exports = router;
