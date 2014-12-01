var express = require( "express" );
var path = require( "path" );
var morgan = require( "morgan" );
var app = express();

// app.use( express.static( "/", path.resolve( __dirname + "/public" ) ) );
app.use( express.static( __dirname + "/../public" ) );
app.use( morgan("dev") );

var server = app.listen( 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log( " " );
  console.log( "Restart timestamp: %s", new Date().toString() );
  console.log( "Webserver listening at http://%s:%s", host, port );
  console.log( " " );

});