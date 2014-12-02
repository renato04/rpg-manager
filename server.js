// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express

var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var port = 8080											//port that will be listen

var account_controller = require('./controllers/account_controller.js');
var aventura_controller = require('./controllers/aventura_controller.js');



app.set('port', (process.env.PORT || port));

var connStr = 'mongodb://rramosna:rramosna@ds052837.mongolab.com:52837/rpg';
mongoose.connect(connStr, function(err) {
    if (err)
    {
    	console.log('Error on connect to MongoDB' + err.toString());
    	throw err;	
    } 
    console.log('Successfully connected to MongoDB');
});


app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.post('/api/account', account_controller.create);
app.post('/api/authenticate', account_controller.logon);
app.post('/api/aventura', aventura_controller.create);
app.get('/api/aventuras/:usuario', aventura_controller.listarPorUsuario);


app.get('/home', function(req, res) {
		res.sendfile('./public/dashboard2.html'); // load the single view file 
	});

app.get('*', function(req, res) {
		res.sendfile('./public/home.html'); // load the single view file 
	});


	
	
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
