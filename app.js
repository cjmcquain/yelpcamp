var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   var campgrounds = [
       {name: "Salmon Creek", image: "https://www.campsitephotos.com/photo/camp/25137/feature_Piedmont_Park-f4.jpg"},
       {name: "Granite Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"},
       {name: "Mountain Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"},
       ];
       
       res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server has started!") 
});