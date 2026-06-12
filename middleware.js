const Listing = require('./models/listing.js');
const Review = require('./models/reviews.js');
const expresserror = require('./utils/expresserror.js');
const { listingsSchema, reviewsSchema} = require('./joischema.js');

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

module.exports.isowner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.curruser._id.equals(listing.owner._id)){
        req.flash('error', 'you are not allowed to perform this action!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor= async (req, res, next)=>{
    let {id, review_id} = req.params;
    let review = await Review.findById(review_id);
    if(!res.locals.curruser._id.equals(review.author._id)){
        req.flash('error', 'you are not allowed to delete this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validate listing on server side using Joi
module.exports.Validatelistings = (req, res, next)=>{
    const {error} = listingsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errMsg);
    }else{
        next();
    }
}

// validate reviews on server side using Joi
module.exports.ValidateReviews = (req, res, next)=>{
    const {error} = reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errMsg);
    }else{
        next();
    }
}