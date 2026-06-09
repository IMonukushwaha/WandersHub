const express = require('express');
const router = express.Router({mergeParams : true}); // to make parent route accessible set mergeparam : true.
const wrapAsync = require('../utils/wrapAsync.js');
const expresserror = require('../utils/expresserror.js');
const { reviewsSchema } = require('../joischema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

// validate reviews on server side using Joi
const ValidateReviews = (req, res, next)=>{
    const {error} = reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errMsg);
    }else{
        next();
    }
}

// reviews 
// post route
router.post('/', ValidateReviews, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash('success', 'Review is added succesfully!');
    res.redirect(`/listings/${listing.id}`);
}));

// delete route
router.delete('/:review_id', wrapAsync(async(req, res)=>{
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Review is deleted succesfully!')
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
