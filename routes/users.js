const express = require('express');
const router = express.Router({ mergeParams: true });
const { catchAsync } = require('../utilities/middleware.js')
const User = require('../models/user.js')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const passportLocal = require('passport-local')
const { renderRegister, register, renderLogin, login, logout } = require('../controllers/users')

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register))

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), catchAsync(login))

router.get('/logout', logout)

module.exports = router;