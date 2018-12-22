var express = require('express');
var router = express.Router();

const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

/*POST delete bot from database */
router.post('/', async function(req, res) {

  let botID = await req.body.confirm;

  console.log('submitted document ID:', botID); //debug

  const result = await Bot.deleteOne({ _id: botID});


  // delete the directory with profile pics too!
  

  console.log(result); // debug
  
  res.redirect('/admin');

});

module.exports = router;