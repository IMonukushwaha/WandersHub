const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Mongo_url = 'mongodb://127.0.0.1:27017/WandersHub';
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const expresserror = require('./utils/expresserror.js');
const listingsSchema = require('./joischema.js');
const Port = 2004;

// import the listing.js path
const Listing = require(path.join(__dirname, 'models', "listing.js"));
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
app.get('/listings', wrapAsync(async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}))

// route new listing
app.get('/listings/new', (req, res)=>{
    res.render('listings/new.ejs');
})

// create route 
app.post('/listings', Validatelistings, wrapAsync(async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}))

// show route
app.get('/listings/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}))

//edit route for updation
app.get('/listings/:id/edit', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
}))

// update route
app.put("/listings/:id", Validatelistings, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete request
app.delete('/listings/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deldata = await Listing.findByIdAndDelete(id);
    console.log(deldata);
    res.redirect(`/listings`);
}))

app.all('/{*path}', (req, res, next)=>{
    next(new expresserror(404, "Page not found!"));
})

app.use((err, req, res, next)=>{
    let {statuscode=500, message="Something went wrong!"} = err;
    res.status(statuscode).render('listings/error.ejs', {message});
})

app.listen(Port, ()=>{
    console.log("App is listeining");
})
