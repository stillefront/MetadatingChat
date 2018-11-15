var express = require('express');
var router = express.Router();

/* Route to backend login */
router.get('/', function(req, res, next) {
  res.render('update');
});

module.exports = router;
