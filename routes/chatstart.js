var express = require('express');
var app = express();
const router = express.Router();

const {Bot} = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//var async = require('async');
var bodyParser = require("body-parser");


// Route to chat


router.get('/', function(req, res, next) {
  //res.send("Hier wird der chat zwischen " + app.locals.bot1 + " und " + app.locals.bot2 + " stattfinden.");
  botAuth1 = Bot.findOne({ 'name': app.locals.bot1 },).exec();
  botAuth2 = Bot.findOne({ 'name': app.locals.bot2 },).exec();
  res.render("chat", {bot1Name: botAuth1.name, bot1ImgPath: botAuth1.image_path, bot2Name: botAuth2.name, bot2ImgPath: botAuth2.image_path })    
});


/*
router.post('/', chat_start.searchForBothToken);
router.get('/', chat_start.index);
*/

module.exports = router;
