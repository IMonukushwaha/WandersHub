const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const expresserror = require('../utils/expresserror.js');
const { listingsSchema } = require('../joischema.js');
const Listing = require('../models/listing.js');

// validate listing on server side using Joi
const Validatelistings = (req, res, next)=>{
    const {error} = listingsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errMsg);
    }else{
        next();
    }
}
 
// listing route
router.get('/', wrapAsync(async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}))

// route new listing
router.get('/new', (req, res)=>{
    res.render('listings/new.ejs');
})

// create a new listing route  
router.post('/', Validatelistings, wrapAsync(async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'Listing is added succesfully!')
    res.redirect('/listings');
}))

// show route
router.get('/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash('error', 'Listing is not in the database!');
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
}))

//edit route for updation
router.get('/:id/edit', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing is not in the database!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', {listing});
}))

// update route
router.put("/:id", Validatelistings, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash('success', 'Listing updated succesfully!');
    res.redirect(`/listings/${id}`);
}))

//delete request
router.delete('/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let deldata = await listing.deleteOne();
    console.log(deldata);
    req.flash('success', 'Listing is deleted succesfully!');
    res.redirect(`/listings`);
}))

module.exports = router;