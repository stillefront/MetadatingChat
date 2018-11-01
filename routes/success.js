var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/botDB')
var db = mongoose.connection;
var Login = require('../models/login');

var test;




/* Route to backend login */
router.get('/', function(req, res, next) {

  Login.find(function (err, users) {
  if (err) return console.error(err);
  //console.log(users);
});


Login.findOne({}, {}, { sort: { '_id' : -1 }}, function(err, recent) {

  test = recent.username;
  console.log("Testfall:", recent.username);

});

  console.log("Testfall 2: ", test);
  res.render('success');

});

module.exports = router;
