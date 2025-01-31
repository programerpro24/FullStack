const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require("../schema.js");
const Listing = require('../models/listing.js');
const {isLoggedIn}=require('../middleware.js');
const ListingController=require('../controllers/listings.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage});


//For validation

const validateListing=(req, res, next)=>{

    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg)
    }else{

        next();
    }
}



router
.route('/')
.get(wrapAsync(ListingController.index))
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing));


//New route
router.get('/New', isLoggedIn, ListingController.renderNewForm);


router.route('/:id')
.get(wrapAsync (ListingController.showListing))
.put(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync (ListingController.updateListing))
.delete(isLoggedIn, wrapAsync (ListingController.destroyListing));



//Edit route 
router.get('/:id/edit', isLoggedIn, wrapAsync (ListingController.renderEditForm));




module.exports=router;