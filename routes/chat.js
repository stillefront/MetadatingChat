const chat_start = require('../controller/chatStart.js');

const express = require('express');
const router = express.Router();


// Route to chat

/*
router.get('/', function(req, res, next) {
  res.render('chat');
});
*/




router.get('/', chat_start.index);

router.post('/', chat_start.searchForBothToken);

module.exports = router;
