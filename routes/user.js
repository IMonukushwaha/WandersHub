const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { SaveredirectUrl } = require('../middleware.js');
const UsersContollers = require('../Controllers/users.js');


router.route('/signup')
// signup form route
.get(UsersContollers.RenderSingupForm)
// signup post route
.post(wrapAsync(UsersContollers.Singup))

router.route('/login')
// login form route
.get(UsersContollers.RenderLoginForm)
// login post route
.post(
    SaveredirectUrl,
    passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
    UsersContollers.login
);

// logout
router.get('/logout', UsersContollers.Logout);

module.exports = router;
