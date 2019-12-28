var express = require('express');
var app = express();
const router = express.Router();

const {Bot} = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//var async = require('async');
var bodyParser = require("body-parser");


// Route to chat


router.post('/', function(req, res, next) {
        app.locals.bot1 = req.body.bot1;
        app.locals.bot2 = req.body.bot2;
        app.locals.userId = req.body.userId;

        console.log("ka zaj?"+ req.body.userId);

        userData = { user_id: req.body.userId, bot1: app.locals.bot1, bot2: app.locals.bot2 }

        User_sessions_informations.create(userData, function (err, User_sessions_informations) {
                if (err) return handleError(err);
                // saved!
              });
    
        //search for the Token from bot1
        Bot.findOne({ 'name': app.locals.bot1 }, 'name image_path workspace_id username_token password_token', function (err, bot_1) {
                if (err) return handleError(err);
                app.locals.bot1Ready = bot_1;
                //console.log("Der Token von " + bot_1.name + " ist " + bot_1.workspace_id_token);
              });
        //search for the Token from bot2
        Bot.findOne({ 'name': app.locals.bot2 }, 'name image_path workspace_id username_token password_token', function (err, bot_2) {
                if (err) return handleError(err);
                app.locals.bot2Ready = bot_2;
                //console.log("Der Token von " + bot_2.name + " ist " + bot_2.workspace_id_token);
                return bot_2
              });
              
    //redirect nach chat oder chatstart!
  res.redirect('/chatstart');
});












/*
router.post('/', chat_start.searchForBothToken);
router.get('/', chat_start.index);
*/




module.exports = router;
