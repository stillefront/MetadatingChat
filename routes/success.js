var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/botDB')
var db = mongoose.connection;
var Login = require('../models/login');


var nameTest;
var pwTest;




/* Route to backend login */
router.get('/', function(req, res, next) {

  Login.find(function (err, users) {
  if (err) return console.error(err);
  //console.log(users);
});


Login.findOne({}, {}, { sort: { '_id' : -1 }}, function(err, recent) {

  test = recent.username;
  console.log("Testfall:", recent.username);
  console.log("Testfall:", recent.password);

});


//JavaScript Promises

const p = new Promise(function(resolve, reject){
  resolve(Login.findOne({}, {}, {sort : { '_id' : -1}}, function(err, recent){
    nameTest = recent.username;
    pwTest = recent.password;
  }));

  reject(new Error('hat nicht geklappt'));
});

p.then(function(result){
  //var nameTest = result.username;
  console.log('Testfall 2: ', nameTest);
  console.log('Testfall 2: ', pwTest);
});


res.render('success', {item: nameTest, item2: pwTest});


});

module.exports = router;
