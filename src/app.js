'use strict';
//I declare all modules
const express = require('express'); //express module
const routes = require('./routes/index');//routes module
const bodyParser = require('body-parser');//module body parser

const app = express(); //function express

	app.use(bodyParser.urlencoded({ //body parser without urlencoded
		extended: false
	}));

	app.disable('etag'); // I disable ETAG which resolves status 304 in localhost

	app.use(express.static(__dirname + '/public')); // dir of all static files
	app.set('view engine', 'pug'); // I set the pug render
	app.set('views', __dirname + '/views');// I set the dir of views


	app.use('/', routes);//Routes is in "/"

	//handle errors
	app.use((req, res, next) => { //if the status of server is 404 I render this message
	  const err = new Error('');
	  err.status = 404;
	  err.message = "UPS!, check your connections...we waiting for you!.. ";
	  next(err);
	});
	//render error in template
	app.use((err, req, res, next) => { //if the status of server is 500 I render this message
	  res.status(err.status || 500);
		err.message = "Talk with our SERVICE CENTER.. ;)";
	  res.render('error', {
	    message: err.message,
	    status: err.status
	  });
	});
	//EXPRESS server
	app.listen(8000), function(){
		console.log('the server is ROCK ON in PORT 8000!');
	};
