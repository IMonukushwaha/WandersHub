const express = require('express');
const router = express.Router({mergeParams : true}); // to make parent route accessible set mergeparam : true.
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const {ValidateReviews, loggedIn, isAuthor} = require('../middleware.js');
const ReviewController = require('../controllers/Reviews.js');

// reviews 
// post route
router.post('/', loggedIn, ValidateReviews, wrapAsync(ReviewController.CreateReview));

// delete route
router.delete('/:review_id', loggedIn, isAuthor, wrapAsync(ReviewController.DestroyReview));

module.exports = router;
