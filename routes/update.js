var express = require('express');
var router = express.Router();

const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

/*POST updated bots into database */
router.post('/', async function(req, res) {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let bot = await Bot.findOne( { name: req.body.name} );
  if (bot) return res.status(400).send('Ein Bot mit diesem Namen ist bereits vorhanden!');

  let botID = await req.body._id;

  let name = await req.body.name;
  let description = await req.body.description;
  let image_path = await req.body.image_path;
  let workspace_id_url = await req.body.workspace_id_url;
  let username_token = await req.body.username_token;
  let password_token = await req.body.password_token;

  


  console.log('submitted document ID:', botID); //debug

  const result = await Bot.updateOne({ _id: botID}, {
    $set: {
      name: name,
      description: description,
      image_path: image_path,
      workspace_id_url: workspace_id_url,
      username_token: username_token,
      password_token: password_token
    }
  });

  console.log(result);
  
  res.redirect('/admin');

});

module.exports = router;