var express = require("express");
var app = express();
var bodyParser = require("body-parser");

   var campgrounds = [
       {name: "Salmon Creek", image: "https://www.campsitephotos.com/photo/camp/25137/feature_Piedmont_Park-f4.jpg"},
       {name: "Granite Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"},
       {name: "Mountain Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"},
              {name: "Salmon Creek", image: "https://www.campsitephotos.com/photo/camp/25137/feature_Piedmont_Park-f4.jpg"},
       {name: "Granite Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"},
       {name: "Mountain Hill", image: "https://www.campsitephotos.com/photo/camp/25311/feature_Prairie_Creek-f4.jpg"}
       ];

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){

       
       res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var newCampground = {name: name, image: image};
   campgrounds.push(newCampground);
   res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server has started!") 
});