var express = require('express');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());
app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000, function() {
	console.log('Listening on port 3000...');
});

