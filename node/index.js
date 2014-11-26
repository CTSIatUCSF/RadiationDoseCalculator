var express = require("express");
var path = require( "path" );
var app = express();

var root = path.resolve();
var tokens = root.split("/");
if (tokens[tokens.length-1] === "node") {
    tokens.splice(-1, 1);
    root = tokens.join("/") + "/";
}

app.get("/", function (req, res) {
  res.sendFile(root + "html/index.html");
});

app.get("/js/app.js", function(req,res){
    res.sendFile(root + "js/app.js");
});

app.get("/css/styles.css", function(req,res){
    res.sendFile(root + "css/styles.css");
});

app.get("/js/data.json", function(req,res){
    res.sendFile(root + "js/data.json");
});

app.get("/js/controllers.js", function(req,res){
    res.sendFile(root + "js/controllers.js");
});

app.get("/js/services.js", function(req,res){
    res.sendFile(root + "js/services.js");
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Webserver listening at http://%s:%s", host, port);

});