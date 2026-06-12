const mongoose = require('mongoose');
const Review = require('./reviews');
const { type } = require('../joischema');
const schema = mongoose.Schema;

const listingSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1720884413532-59289875c3e1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v) => v ==="" ? "https://images.unsplash.com/photo-1720884413532-59289875c3e1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.pre('deleteOne', { document: true, query: false }, async function () {
    if(this.reviews && this.reviews.length>0){
        await Review.deleteMany({_id : {$in : this.reviews}});
        console.log(`Deleted ${this.reviews.length} reviews from listing: ${this._id}`);
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;