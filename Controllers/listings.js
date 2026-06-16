const Listing = require('../models/listing.js');
const {geocode} = require('../geocoding.js')

module.exports.index = async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}

module.exports.RendernewForm = (req, res)=>{
    res.render('listings/new.ejs');
}

module.exports.CreateNewListing = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    let coord = await geocode(newListing.location);
    console.log([coord.lng, coord.lat]);
    let grometry = {
        type : 'Point',
        coordinates : [coord.lng, coord.lat]
    }
    newListing.geometry = grometry;
    await newListing.save();
    req.flash('success', 'Listing is added succesfully!')
    res.redirect('/listings');
}

module.exports.ShowListing = async (req, res)=>{
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
}
module.exports.RenderEditform = async (req, res)=>{
     let {id} = req.params;
     let listing = await Listing.findById(id);
     if(!listing){
         req.flash('error', 'Listing is not in the database!');
         return res.redirect('/listings');
     }
     let orgimage = listing.image.url;
     let previewimg = orgimage.replace('/upload', '/upload/c_fill/w_200');
     res.render('listings/edit.ejs', {listing, previewimg});
}

module.exports.EditLisitng = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash('success', 'Listing updated succesfully!');
    res.redirect(`/listings/${id}`);
}

module.exports.DestroyLisitng = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let deldata = await listing.deleteOne();
    req.flash('success', 'Listing is deleted succesfully!');
    res.redirect(`/listings`);
}