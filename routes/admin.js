var express = require('express');
var router = express.Router();

/* Route to admin panel */
// CRUD operations on bot database come here!
router.get('/', function (req, res, next){
  res.render('admin');
});

module.exports = router;
