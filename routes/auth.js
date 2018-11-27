const Joi = require('joi'); 
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async function(req, res) {
  const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  if (error) return  res.render('errorpage', {errorLog: 'Bitte Passwort und Nutzernamen eingeben!'})
  
  let user = await User.findOne( { username: req.body.username} );
  // if (!user) return res.status(400).send('Nutzername oder Passwort nicht vorhanden!');
  if (!user) {
    //res.redirect('/login');
    let errorLog = "Nutzername oder Passwort nicht vorhanden!";
    res.render('errorpage', {errorLog : errorLog});
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  // if (!validPassword) return res.status(400).send('Nutzername oder Passwort nicht vorhanden!');
  if (!validPassword) {
    //res.redirect('/login');
    //res.render('errorpage' , {errorLog : errorLog});
    let errorLog = "Nutzername oder Passwort nicht vorhanden!";
    res.render('errorpage', {errorLog : errorLog});
  }

  req.session.userId = await user._id;
  req.session.userName = await user.username;
 
  res.redirect('/admin');

  

  function validate(req) {
    const schema = {
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

});



module.exports = router;