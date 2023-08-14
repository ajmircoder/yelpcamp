const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.createNewUser));

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo,
        passport.authenticate('local',
            { failureFlash: true, failureRedirect: '/login' }),users.loginUser);

router.get('/logout', users.logout);

module.exports = router;