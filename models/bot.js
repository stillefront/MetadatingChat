
const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema ({
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
        workspace_id_token: {
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
          required: true
        },
        isPublic: {
          type: Boolean,
          required: true
        }
});


module.exports = mongoose.model('Bot', BotSchema);


