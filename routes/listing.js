const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require("../schema.js");
const Listing = require('../models/listing.js');




const validateListing=(req, res, next)=>{

    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg)
    }else{

        next();
    }
}



// Index All
router.get('/', wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings})

}))

//New route
router.get('/New', wrapAsync (async (req, res)=>{
    res.render('./listings/new.ejs')
}))


//Show route
router.get('/:id', wrapAsync (async (req, res)=>{
let {id}=req.params;
const listing=await Listing.findById(id).populate("reviews");
if(!listing){
req.flash("error", "Listing you request for does not exist!");
res.redirect('/listings');
}
res.render('./listings/show.ejs', {listing});
}))



//create route
router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
        
    const newListing=new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}))


router.get('/:id/edit', wrapAsync (async (req, res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
if(!listing){
    req.flash("error", "Listing you request for does not exist!");
    res.redirect('/listings');
}    
res.render('listings/edit.ejs', {listing});
}))


//update
router.put('/:id', validateListing, wrapAsync (async (req, res)=>{    
let {id}=req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});

req.flash("success", "Listing updated!");
res.redirect('/listings');
}))


//Delete route
router.delete('/:id', wrapAsync (async (req, res) => {
const { id } = req.params;
const deletedListing = await Listing.findByIdAndDelete(id);
req.flash("success", "Listing deleted!");
res.redirect("/listings");
}));

module.exports=router;