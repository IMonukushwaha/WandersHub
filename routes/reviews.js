const express = require('express');
const router = express.Router({mergeParams : true}); // to make parent route accessible set mergeparam : true.
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const {ValidateReviews, loggedIn, isAuthor} = require('../middleware.js');

// reviews 
// post route
router.post('/', loggedIn, ValidateReviews, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash('success', 'Review is added succesfully!');
    res.redirect(`/listings/${listing.id}`);
}));

// delete route
router.delete('/:review_id', loggedIn, isAuthor, wrapAsync(async(req, res)=>{
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Review is deleted succesfully!')
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
