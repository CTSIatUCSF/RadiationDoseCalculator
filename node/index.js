var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + '../html/index.html');
});

app.get('/js/app.js', function(req,res){
    res.sendFile(__dirname + '../js/app.js');
});

app.get('/css/styles.css', function(req,res){
    res.sendFile(__dirname + '../css/styles.css');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Webserver listening at http://%s:%s", host, port);

});