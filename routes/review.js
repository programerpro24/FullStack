const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/reviews.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema}=require("../schema.js");
const Listing = require('../models/listing.js');
const {isLoggedIn, isReviewAuthor}=require('../middleware.js');
const ReviewController=require('../controllers/reviews.js');




//for validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//create review
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));
    
//delete route 
router.delete( "/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));
        
module.exports=router;