const express = require('express');
const router = express.Router();

const {Bot} = require('../models/bot');
/* GET home page. */
router.get('/', async function(req, res, next) {

  const bot_list = await Bot.find({ isPublic: "true" }, 'name description image_path');
  res.render('index', { title: 'meta.dating', bot_list : bot_list});
});




module.exports = router;
