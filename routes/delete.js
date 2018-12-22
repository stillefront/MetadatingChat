var express = require('express');
var router = express.Router();

const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

const fs = require('fs');

/*POST delete bot from database */
router.post('/', async function(req, res) {

  let botID = await req.body.confirm;
  let bot = await Bot.findOne({_id: botID});
  let image_path = bot.image_path;
  let botDir = 'uploads/' + req.session.userId + '/' + botID + '/';

  console.log('submitted document ID:', botID); //debug

  const result = await Bot.deleteOne({ _id: botID});

  // delete profile pic
  fs.unlinkSync(image_path);

  // delete the directory
  
  fs.rmdirSync(botDir, {recursive: true}, function(err){
    if(err) throw err;
  });
  //
  

  console.log(result); // debug
  
  res.redirect('/admin');

});

module.exports = router;