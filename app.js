//Requirements
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session=require('express-session');
const flash=require("connect-flash");


//Connection
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

//Mongoose run
main()
  .then(() => {
    console.log("Yes, I am in");
  })
  .catch((err) => {
    console.log(err);
  });

//Mongoose connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,

  }
}

//Home
app.get("/", (req, res) => {
  res.send("Hi, i am root");
});

//cookies 
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

//Listings and Reviews
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

//Error show
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//Error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//Server starting
app.listen(8080, () => {
  console.log("Server is listening");
});
