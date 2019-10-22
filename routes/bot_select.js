let express = require('express');
let router = express.Router();

// Route to botchat

router.get('/', function(req, res, next) {
  res.render('bot_select');
});

module.exports = router;