// for future implementation: npm install joi-password-complexity

const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 30, 
    unique: true
  },
  password: {
    type: String, 
    required: true,
    minlength: 6,
    maxlength: 1024,
    unique: true
  }
}); 


const User = mongoose.model('User', userSchema);



function validateUser(user) {
  const schema = {
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(1024).required()
  };

  return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;
