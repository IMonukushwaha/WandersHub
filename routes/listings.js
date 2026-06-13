const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {loggedIn, isowner, Validatelistings} = require('../middleware.js');
const listingController = require('../controllers/listings.js');

// listing route
router.get('/', wrapAsync(listingController.index))

// route new listing
router.get('/new', loggedIn, listingController.RendernewForm)

// create a new listing route  
router.post('/', loggedIn, Validatelistings, wrapAsync(listingController.CreateNewListing))

// show route
router.get('/:id', wrapAsync(listingController.ShowListing))

//edit route for updation
router.get('/:id/edit', loggedIn, isowner, wrapAsync(listingController.RenderEditform))

// update route
router.put("/:id", loggedIn, isowner, Validatelistings, wrapAsync(listingController.EditLisitng))

//delete request
router.delete('/:id', loggedIn, isowner, wrapAsync(listingController.DestroyLisitng))

module.exports = router;