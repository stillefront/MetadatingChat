var express = require('express');
var router = express.Router();

/* Route to available bot list*/
router.get('/', function(req, res, next) {
  res.render('bots');
});

module.exports = router;
