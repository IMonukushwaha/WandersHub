const mongoose = require('mongoose');
const initData = require('./coordinates.js');
const Listing = require("../models/listing.js");
const { init } = require('../models/reviews.js');

const Mongo_url = 'mongodb://127.0.0.1:27017/WandersHub';

async function main() {
    await mongoose.connect(Mongo_url);
}

main().then(res => {console.log("Connected to DB")})
.catch(err => console.log(err));

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : '6a2a9af58906400e12f7be0f'
    }));
    await Listing.insertMany(initData.data);
    console.log("data is inititalized succesfully");
};

initDB();
