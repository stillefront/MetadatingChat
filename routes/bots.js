const express = require('express');
const router = express.Router();

const {Bot} = require('../models/bot');

/* Route to available bot list*/
//list all available bots; future: check for "public = 'true' in DB document"
router.get('/', async function(req, res, next) { 

  const list_bots = await Bot.find({ isPublic: "true" }, 'name description image_path'); 
  res.render('bot_select', {title: 'meta.dating 2018: BOTIFY!', list_bots : list_bots});
  
});

module.exports = router;
