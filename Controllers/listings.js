const Listing = require('../models/listing.js');

module.exports.index = async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}

module.exports.RendernewForm = (req, res)=>{
    res.render('listings/new.ejs');
}

module.exports.CreateNewListing = async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
     res.render('listings/edit.ejs', {listing});
}

module.exports.EditLisitng = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
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