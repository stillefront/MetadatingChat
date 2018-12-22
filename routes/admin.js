const auth = require('../middleware/auth');

const formidable = require('formidable');
const fs = require('fs');

const express = require('express');
const router = express.Router();

const _ = require('lodash');
const {Bot, validate} = require('../models/bot');

/* Route to admin panel */

router.get('/', auth, async function (req, res){

  //console.log( "/admin: user id:" , req.session.userId, " user name: " , req.session.userName);
  const userName = req.session.userName;
  const userId = req.session.userId;
  
  const bot_query = await Bot.find({owner : userId}); 
  res.render('admin', {bot_query : bot_query, userName : userName});
  //console.log(bot_query);
  
});


router.post('/newbot', async function (req, res){
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let bot = await Bot.findOne( { name: req.body.name} );
  if (bot) return res.status(400).send('Ein Bot mit diesem Namen ist bereits vorhanden!');

  let botData = {
    'name' : req.body.name, 
    'description' : req.body.description, 
    'image_path' : 'null', 
    'workspace_id' : req.body.workspace_id,
    'iam_apikey' : req.body.iam_apikey, 
    'date_created' : req.body.date_created, 
    'owner' : req.session.userId, 
    'isPublic' : req.body.isPublic
  };
  console.log(botData);

  bot = new Bot(_.pick(botData, ['name', 'description', 'image_path', 'workspace_id', 'iam_apikey', 'date_created', 'owner', 'isPublic']));

  await bot.save();

  let bot2 = await Bot.findOne( {name: req.body.name} );
  
  // make new directory for bot profile pic
  // let botDir = 'uploads/' + req.session.userId + '/' + req.body.name + '/';
  let botDir = 'uploads/' + req.session.userId + '/' + bot2._id + '/';
  fs.mkdirSync(botDir, {recursive: true}, function(err){
    if(err) throw err;
  });

  // copy default profile pic to new directory
  let picDest = botDir + 'profile.png';
  fs.copyFileSync('default.png', picDest, function(err){
    if(err) throw err;
  });

  // update bot image path in database
  const result = await Bot.updateOne({ name: req.body.name}, {
    $set: {
      image_path: picDest
    }
  });
  console.log(result);
 

  res.redirect('/admin');

});

module.exports = router;

