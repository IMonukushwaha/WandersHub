const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');

module.exports.CreateReview = async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash('success', 'Review is added succesfully!');
    res.redirect(`/listings/${listing.id}`);
}

module.exports.DestroyReview = async(req, res)=>{
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Review is deleted succesfully!')
    res.redirect(`/listings/${id}`);
}