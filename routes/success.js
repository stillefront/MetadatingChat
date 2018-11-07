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
});



//JavaScript Promises with async and await


async function recentUser(){
  const recentUser = await getRecentUser();
  console.log('most recent User in database: ', recentUser.username);
  nameTest = recentUser.username;
  pwTest = recentUser.password;

  res.render('success', {item: nameTest, item2: pwTest});
}

recentUser();

function getRecentUser() {
  return new Promise(function(resolve, reject){
    resolve(Login.findOne({}, {}, {sort :{'_id' : -1}}, function(err, recent){
      //more stuff to do and to get...
    }));
  });
}

//TODO: resolve Errors!


});

module.exports = router;
