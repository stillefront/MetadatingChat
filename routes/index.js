var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/';
var dbName = 'botDB';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chatbotchat' });
});


// Router in Ordnung bringen!

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  //mongoTest ab hier: Daten aus meiner angelegten collection "bot-data" auslesen
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    console.log("MongoDB: Connection to server successful");
    var db = client.db(dbName);


    db.collection('bot_data').find({}).toArray(function(err, result){
      assert.equal(null, err);
      console.log(result);
      client.close();
    });
    //client.close();
  });
  //mongotTest Ende
  res.redirect('/')


});


//Hier wird beim Absenden der Daten ein Objekt erzeugt und in die Datenbank gestopft
// schließlich wird man zu root zurückgeleitet mit "res.redirect('/')"
router.post('/insert', function(req, res, next) {
  var item = {
    name: req.body.name,
    description: req.body.description,
    workspace_id: req.body.workspace_id,
    user_token: req.body.user_token,
    password_token: req.body.password_token
  };

  console.log(item);

  //mongoTest ab hier: Daten in die collection "bot-data" einspeisen
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    console.log("MongoDB: Connection to server successful");

    var db = client.db(dbName);

    db.collection('bot_data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log("Item inserted!");
    });

    //client.close();
  });
  //mongoTest Ende

  res.redirect('/')
});

router.post('/update', function(req, res, next) {

});

router.post('/delete', function(req, res, next) {

});




module.exports = router;
