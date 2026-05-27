const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Mongo_url = 'mongodb://127.0.0.1:27017/WandersHub';
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const expresserror = require('./utils/expresserror.js');
const {listingsSchema, reviewsSchema} = require('./joischema.js');
const Listing = require('./models/listing.js');
const Review = require('./models/reviews.js');
const reviews = require('./models/reviews.js');

const listings = require('./routes/listings.js');

const Port = 2004;

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect(Mongo_url);
}

main().then(res => {console.log("Connected to DB")})
.catch(err => console.log(err));

app.get('/', (req, res)=>{
    res.send("Working");
})

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

app.use('/listings', listings);

// reviews 
// post route
app.post('/listings/:id/reviews', ValidateReviews, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing.id}`);
}));

// delete route
app.delete('/listings/:id/reviews/:review_id', wrapAsync(async(req, res)=>{
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`);
}));

app.all('/{*path}', (req, res, next)=>{
    next(new expresserror(404, "Page not found!"));
})

app.use((err, req, res, next)=>{
    let {statuscode=500, message="Something went wrong!"} = err;
    res.status(statuscode).render('listings/error.ejs', {message});
})

app.listen(Port, ()=>{
    console.log("App is listening");
})
