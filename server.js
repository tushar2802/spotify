var express = require('express');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
var output = new Array();
var spotifyApi = new SpotifyWebApi({
  clientId : '72f367755ecb493093cc9a73f958684d',
  clientSecret : 'b021ffa892e347ef8057f95f7f7e4961',
  redirectUri : 'http://localhost/'
});
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
// Serve index.html
app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
// Create JSON for search output
app.post('/', function (req, res) {
   response = {
      search_text:req.body.q,
   };

	spotifyApi.searchTracks(response.search_text)
	.then(function(data) {
  	console.log("Querying: " +response.search_text);
  	for(var i = 0; i < data.body.tracks.items.length; i++) {
  		output[i] = {
  			track : data.body.tracks.items[i].name,
  			album : data.body.tracks.items[i].album.name,
  			artist : data.body.tracks.items[i].artists[0].name
  		};
	}
	showTable();
  }, function(err) {
    console.error(err);
  });
// Render HTML table 
  function showTable() {
  	  res.setHeader('Content-Type', 'text/html');
  		res.write('<table border=2 cellspacing=2 cellpadding=2><tr><th>Track</th><th>Album</th><th>Artist</th></tr>');
  	
		for (var i = 0; i < output.length; i++) {
			res.write('<tr><td>');
			res.write(output[i].track);
			res.write('</td>');
			res.write('<td>');
			res.write(output[i].album);
			res.write('</td>');
			res.write('<td>');
			res.write(output[i].artist);
			res.write('</td></tr>');
		}
		res.write('</table>')
  	res.end();
  }
})
// Start Express.js
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://localhost:%s", port)
})