var express = require('express');
var router = express.Router();

const {Bot, validate} = require('../models/bot');
const mongoose = require('mongoose');

const formidable = require('formidable');
const fs = require('fs');

/*POST updated bots into database */
router.post('/', async function(req, res) {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let botID = await req.body._id;

  let name = await req.body.name;
  let description = await req.body.description;
  let workspace_id = await req.body.workspace_id;
  let username_token = await req.body.username_token;
  let password_token = await req.body.password_token;
  let isPublic = await req.body.isPublic;

  console.log(isPublic);

  // image upload test //
  let bot;
  try {
    bot = await Bot.findOne( {name: name});
    console.log(bot._id);
    console.log(bot.owner);
  } catch (err) {
    return res.status(500).send()
  }
  
  let form = await new formidable.IncomingForm();
  let uploadPath = 'uploads/' + bot.owner + '/' + bot._id + '/'; // hier die object id des bots aus der datenbank holen
  let fileSize = 1024 * 1024; // one megabyte
  form.maxFileSize = 3 * fileSize; // 3 megabytes
  console.log(uploadPath);

  form.parse(req);
  
  form.on('fileBegin', function (name, file){
    fileType = file.type.split('/').pop(); // determine filetype
    console.log(fileType);

    file.path = uploadPath + file.name;
  });

  form.on('file', function (name, file){
    
    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
      console.log('Uploaded ' + file.name);
    } else {
      console.log('invalid type');
      fs.unlink(file.path);
      console.log('deleted: ' + file.path);
      
    }
  });

  // image upload test end //


  console.log('submitted document ID:', botID); //debug

  const result = await Bot.updateOne({ _id: botID}, {
    $set: {
      name: name,
      description: description,
      workspace_id: workspace_id,
      username_token: username_token,
      password_token: password_token,
      isPublic: isPublic 
    }
  });

  console.log(result);
  
  res.redirect('/admin');

});

module.exports = router;