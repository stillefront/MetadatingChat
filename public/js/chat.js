var express = require('express');
var app = express();

const {Bot} = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//var async = require('async');
var bodyParser = require("body-parser");

        app.locals.bot1 = firstSelectedBot;
        app.locals.bot2 = secondSelectedBot;
        app.locals.userId = userId;


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
              
 



console.log(firstSelectedBot + " " + secondSelectedBot + " " + userId); // debug

console.log(bot_1 + " " + bot_2 + " " + "database success?"); // debug


var tmpMsg1 = "<div class='bot1-msg'><p>First Message</p></div>"
var tmpMsg2 = "<div class='bot2-msg'><p>Second Message</p></div>"

function pingpong() {
    setTimeout(function () {
        console.log('pingpong start')

        $('#messages').append(tmpMsg1)

        setTimeout(function() {
            $('#messages').append(tmpMsg2)
        }, 1000)

    }, 1000)
}



