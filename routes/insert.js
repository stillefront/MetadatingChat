// implementing login
// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/botDB')
var db = mongoose.connection;
var Login = require('../models/login');


/* Route to backend login */
router.post('/', function(req, res, next) {

  db.on('error', console.error.bind(console, 'Mongoose: Fehler: '));

  console.log('Mongoose insert.js: Verbunden!'); // debug

    console.log('Hallo, ich bin insert!');

    var user = new Login({
      username: req.body.login,
      password: req.body.password
    });

    console.log('Mongoose model of username: ', user.username);
    console.log('Mongoose model of password: ', user.password);

    // save to actual database:

    user.save(function (err, user){
      if (err) return console.error(err);
      user.username;
      user.password;
    });

    Login.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
  });

res.redirect('/login');

});



module.exports = router;
