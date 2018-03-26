var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config');
var auth = require('./auth.js')();

var app = express();

mongoose.connect(config.database);


// APP PORT
var port = 3000

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(auth.initialize());
// app.use(passport.authenticate('jwt', config.jwtSession));

// routes
app.get('/', function(req, res) {
  res.send('Hello there! The api is located at http://localhost:' + port + '/api');
})
app.use('/api', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(port);
console.log('Server started on port ' + port);
