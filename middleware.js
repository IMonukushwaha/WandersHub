module.exports.loggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "Login to the website");
        return res.redirect('/user/login');
    }
    next();
};