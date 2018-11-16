var express = require('express');
var router = express.Router();

const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

/*POST updated bots into database */
router.post('/', async function(req, res) {

  let botID = await req.body.document_id;

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