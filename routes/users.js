const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/', async function(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne( { username: req.body.username} );
  if (user) return res.status(400).send('Nutzername bereits registriert!');

  user = new User(_.pick(req.body, ['username', 'password']));

  // generating salt and hash password...
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send(_.pick(user, ['username']));
});

module.exports = router;
