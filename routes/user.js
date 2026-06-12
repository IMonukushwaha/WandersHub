const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { SaveredirectUrl } = require('../middleware.js');

router.get('/signup', (req, res)=>{
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync( async (req, res, next)=>{
    try{
        let {username, email, password} = req.body;
        const newuser = new User({email, username});
        let registered_user = await User.register(newuser, password);
        req.login(registered_user, (err)=>{
            if(err){
                return next(err);
            }
            req.flash('success', "Welcome to WandersHub");
            console.log(registered_user);
            res.redirect('/listings');
        })
    }catch(e){
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/user/signup');
    }
}));

router.get('/login', (req, res)=>{
    res.render('users/login.ejs');
});

router.post('/login', 
    SaveredirectUrl,
    passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
    async (req, res)=>{
        req.flash('success', "Welcome back to WandersHub");
        let url = res.locals.redirectUrl || "/listings";
        res.redirect(url);
    }
);

// logout
router.get('/logout', (req, res, next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash('success', "Succesfully logout");
        res.redirect('/listings');
    })
});

module.exports = router;
