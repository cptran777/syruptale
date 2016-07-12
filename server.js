var express = require('express');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var app = express();

var db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root', 
	password: 'syrup3',
	database: 'syrup'
});

db.connect();

app.use(bodyparser.json());
app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000, function() {
	console.log('Listening on port 3000...');
});

