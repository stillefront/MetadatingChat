const mongoose = require('mongoose');
const Joi = require('joi');


const botSchema = new mongoose.Schema ({
        name: {
          type: String, 
          required: true
        },
        description: {
          type: String
        },
        image_path: {
          type: String
        },
        workspace_id_url: {
          type: String,
          required: true
        },
        username_token: {
          type: String,
          required: true
        },
        password_token: {
          type: String,
          required: true
        },
        date_created: {
          type: Date, 
          default: Date.now
        },
        owner: {
          type: String,
          //required: true
        },
        isPublic: {
          type: Boolean,
          //required: true
        }
});

const Bot = mongoose.model('Bot', botSchema);

function validateBot(bot) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(255),
    image_path: Joi.string().min(5).max(255),
    workspace_id_url: Joi.string().min(5).max(255).required(),
    username_token: Joi.string().min(5).max(255).required(),
    password_token: Joi.string().min(5).max(255).required(),
    date_created: Joi.string().min(5).max(255),
    owner: Joi.string().min(5).max(255)
  };

  return Joi.validate(bot, schema);
}


exports.Bot = Bot;
exports.validate = validateBot;

//module.exports = mongoose.model('Bot', BotSchema);


