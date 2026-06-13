const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { SaveredirectUrl } = require('../middleware.js');
const UsersContollers = require('../Controllers/users.js');

router.get('/signup', UsersContollers.RenderSingupForm);

router.post('/signup', wrapAsync(UsersContollers.Singup));

router.get('/login', UsersContollers.RenderLoginForm);

router.post('/login', 
    SaveredirectUrl,
    passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
    UsersContollers.login
);

// logout
router.get('/logout', UsersContollers.Logout);

module.exports = router;
