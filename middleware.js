module.exports.loggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to the website");
        return res.redirect('/user/login');
    }
    next();
};

module.exports.SaveredirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl  = req.session.redirectUrl;
    }
    next();
};