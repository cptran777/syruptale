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

// Set up middleware: 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyparser.json());
app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
	res.render('index');
});

// Expects a get request for a specific mob to return to be spawned. 
app.get('/mobs', function(req, res) {
	db.query('select * from mobs where name="' + req.query.name + '"', function(err, rows, fields) {
		if (rows && rows[0]) {
			res.send({
				result: {
					hp: rows[0].hp,
					atk: rows[0].attack,
					def: rows[0].defense,
					spritesheet: rows[0].spritesheet
				}
			});
		}
	});
});

app.listen(3000, function() {
	console.log('Listening on port 3000...');
});

