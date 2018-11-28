/*
let express = require('express');
let router = express.Router();

// Route to botchat
router.get('/', function(req, res, next) {
  res.render('chat');
});

module.exports = router;
*/
let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");

// Require controller modules.

let bot_controller = require('../controllers/botController');
let chat_start = require('../controllers/chatStart');
let chat_start_onebot = require('../controllers/chatStart_onebot');

/// Routes ///


// GET select bots "bot_welcome.pug"
router.get('/', bot_controller.index)

// GET chat app
router.get('/chat', chat_start.index) 

router.get('/chat_onebot', chat_start_onebot.index) 

//route the POST information to the search query to search for the tokens of selected bots
router.post('/chat', chat_start.searchForBothToken)

router.post('/chat_onebot', chat_start_onebot.searchForBothToken)


module.exports = router;
