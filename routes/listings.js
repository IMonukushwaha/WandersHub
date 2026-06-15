const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {loggedIn, isowner, Validatelistings} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const {storage} = require('../CloudConfig.js')
const upload = multer({ storage })

router.route('/')
// listing route
.get(wrapAsync(listingController.index))
// create a new listing route  
.post(loggedIn, 
    Validatelistings, 
    upload.single('listing[image]'), 
    wrapAsync(listingController.CreateNewListing)
)

// route new listing
router.get('/new', loggedIn, listingController.RendernewForm)

router.route('/:id')
// show route
.get(wrapAsync(listingController.ShowListing))
// update route
.put(loggedIn, isowner, Validatelistings, upload.single('listing[image]'), wrapAsync(listingController.EditLisitng))
//delete request
.delete(loggedIn, isowner, wrapAsync(listingController.DestroyLisitng))

//edit route for updation
router.get('/:id/edit', loggedIn, isowner, wrapAsync(listingController.RenderEditform))

module.exports = router;