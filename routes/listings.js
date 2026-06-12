const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {loggedIn, isowner, Validatelistings} = require('../middleware.js');

// listing route
router.get('/', wrapAsync(async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}))

// route new listing
router.get('/new', loggedIn, (req, res)=>{
    res.render('listings/new.ejs');
})

// create a new listing route  
router.post('/', loggedIn, Validatelistings, wrapAsync(async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Listing is added succesfully!')
    res.redirect('/listings');
}))

// show route
router.get('/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate(
        {path : 'reviews',
            populate :
            {
                path : 'author',
            },
    }).populate('owner');
    if(!listing){
        req.flash('error', 'Listing is not in the database!');
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
}))

//edit route for updation
router.get('/:id/edit', loggedIn, isowner, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing is not in the database!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', {listing});
}))

// update route
router.put("/:id", loggedIn, isowner, Validatelistings, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash('success', 'Listing updated succesfully!');
    res.redirect(`/listings/${id}`);
}))

//delete request
router.delete('/:id', loggedIn, isowner, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let deldata = await listing.deleteOne();
    req.flash('success', 'Listing is deleted succesfully!');
    res.redirect(`/listings`);
}))

module.exports = router;