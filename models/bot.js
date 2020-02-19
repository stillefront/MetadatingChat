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
        assistant_id: {
          type: String,
          required: true
        },
        apikey: {
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
    _id: Joi.string().min(5).max(50),
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(0).max(255),
    assistant_id: Joi.string().min(5).max(255).required(),
    apikey: Joi.string().min(5).max(255).required(),
    date_created: Joi.string().min(5).max(255),
    owner: Joi.string().min(5).max(255),
    isPublic: Joi.boolean().truthy('true').falsy('false').insensitive(false),
    upload: Joi.binary()
  };

  return Joi.validate(bot, schema);
}

// virtual for bot's URL
botSchema
.virtual('url')
.get(function () {
  return '/main/bot/' + this._id;
});


exports.Bot = Bot;
exports.validate = validateBot;

//module.exports = mongoose.model('Bot', botSchema);


