// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express

var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var multer  = require('multer')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080											//port that will be listen

var account_controller = require('./controllers/account_controller.js');
var aventura_controller = require('./controllers/aventura_controller.js');
var personagem_controller = require('./controllers/personagem_controller.js');



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
app.use(multer({ dest: './uploads/'}))

app.post('/api/account', account_controller.create);
app.post('/api/authenticate', account_controller.logon);

app.post('/api/aventura', aventura_controller.create);
app.post('/api/aventura/:id', aventura_controller.apagar);
app.get('/api/aventura/:id', aventura_controller.obter);
app.get('/api/aventuras/:usuario', aventura_controller.listarPorUsuario);

app.post('/api/personagem', personagem_controller.create);
app.post('/api/personagem/:id', personagem_controller.apagar);
app.get('/api/personagem/:id', personagem_controller.obter);
app.get('/api/personagem/aventura/:aventura', personagem_controller.listarPorAventura);
app.get('/api/personagem/codigo/:codigo', personagem_controller.obterPorCodigo);


app.get('/home', function(req, res) {
		res.sendfile('./public/dashboard2.html'); // load the single view file 
	});

app.get('/photos/new', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Data: <input type="filename" name="filename" enctype="multipart/form-data"/></p>'
    + '<p>file: <input type="file" name="file" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/photos/new', function(req, res) {

console.log(req.body)
console.log(req.files)
});



app.get('*', function(req, res) {
		res.sendfile('./public/home.html'); // load the single view file 
	});


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('personagemAtualizado', function(personagem){
        console.log('personagemAtualizado: ' + personagem);
        io.emit('personagemAtualizado', personagem);        
    });  

    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    // });  
});

	
http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
