var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "Once again I would like to be a great developer",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
            }
        });
});

app.post("/campgrounds", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc};
   //Create new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated) {
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   });
   
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// =======================
// COMMENTS ROUTES
// =======================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err) {
                   console.log(err);
               } else {
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});
// ========================
// AUTHENTICATION ROUTES
// ========================
app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

// Show Login Form
app.get("/login", function(req, res){
    res.render("login");
});

// Handling Login Logic
app.post("/login", passport.authenticate("local", 
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"    
    }), function(req, res){
    
});

// Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }  
  res.redirect("/login");
}



app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server has started!");
});