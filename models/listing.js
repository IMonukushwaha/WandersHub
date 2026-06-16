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
        url : String,
        filename : String
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
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
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