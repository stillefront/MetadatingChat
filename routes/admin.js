var express = require('express');
var router = express.Router();

const _ = require('lodash');
const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

/* Route to admin panel */
// CRUD operations on bot database come here!


router.get('/', function (req, res, next){
  res.render('admin');
});

router.post('/newbot', async function (req, res){
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let bot = await Bot.findOne( { name: req.body.name} );
  if (bot) return res.status(400).send('Ein Bot mit diesem Namen ist bereits vorhanden!');

  bot = new Bot(_.pick(req.body, ['name', 'description', 'image_path', 'workspace_id_url', 'username_token', 'password_token', 'date_created', 'owner', 'isPublic']));

  await bot.save();

  res.render('admin');

});

router.get('/show', async function (req, res, next){

  const bot_queries = await Bot.find();
 
  console.log(bot_queries);

  res.render('admin');
});


/*
router.post('/update', function (req, res, next){
  
});

router.post('/delete', function (req, res, next){
  
});

*/


module.exports = router;

