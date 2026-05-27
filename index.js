const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Mongo_url = 'mongodb://127.0.0.1:27017/WandersHub';
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const expresserror = require('./utils/expresserror.js');

// routes
const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');

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

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

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
