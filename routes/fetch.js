const express = require('express');
const app = express();
const router = express.Router();

const {Bot} = require ('../models/bot');
const User_sessions_informations = require ('../models/user_sessions_informations');

/* Lookup chosen bots and save credentials into session */
router.post('/', async function(req, res, next) { 
    app.locals.bot1 = req.body.bot1;
    app.locals.bot2 = req.body.bot2;
    app.locals.userId = req.body.userId;

    
    userData = { 
        user_id: req.body.userId, 
        bot1: app.locals.bot1, 
        bot2: app.locals.bot2 
    }
    
    console.log('userData: ', userData);
    
    
    let botAuth1 = await Bot.findOne({ 'name': app.locals.bot1 },).exec();
    let botAuth2 = await Bot.findOne({ 'name': app.locals.bot2 },).exec();
    console.log("debug post.chat: " + botAuth1.name + " " + botAuth1._id + " " + botAuth2.name + " " + botAuth2._id)

    
    User_sessions_informations.create(userData, function (err, User_sessions_informations) {
        if (err) return handleError(err);
      });

    // get tokens for chosen bots
    
    Bot.findOne({ 'name': app.locals.bot1 }, 'name image_path workspace_id_url username_token password_token', function (err, bot_1) {
        if (err) return handleError(err);
        app.locals.bot1Ready = bot_1
        console.log("Der Token von " + bot_1.name + " ist " + bot_1.workspace_id_url);
      });

    Bot.findOne({ 'name': app.locals.bot2 }, 'name image_path workspace_id_url username_token password_token', function (err, bot_2) {
        if (err) return handleError(err);
        app.locals.bot2Ready = bot_2
        console.log("Der Token von " + bot_2.name + " ist " + bot_2.workspace_id_url);
    });        
    
    async function redirectChat(){
        try {
            res.redirect('/chat');
        } catch(err){
            alert(err);
        }
    }
    await redirectChat;
    //res.redirect('/chat');
    //res.render('chat', {bot1Name: botAuth1.name, bot1ImgPath: botAuth1.image_path, bot2Name: botAuth2.name, bot2ImgPath: botAuth2.image_path });
    
    res.render('chat');
});


module.exports = router;
