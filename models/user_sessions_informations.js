// Sessions info for users using the chat app

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User_sessions_informationsSchema = new Schema (
    {
        user_id: {type: String},
        bot1: {type: String},
        bot2: {type: String},
    }
);

// Virtual for Bot's URL
User_sessions_informationsSchema
.virtual('url')
.get(function () {
  return '/main/user_sessions_informations/' + this._id;
});

module.exports = mongoose.model('User_sessions_informations', User_sessions_informationsSchema);


