// user credentials hashing model
// as described here: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

var LoginSchema = new Schema ({
        username: {type: String, required: true, index: { unique: true}},
        password: {type: String, required: true}
});

LoginSchema.pre('save', function(next){
  var login = this;

// check if password is present or has been modified
if (!login.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
  if (err) return next(err);

  // hash the new password
  bcrypt.hash(login.password, salt, function(err, hash) {
    if (err) return next(err);

    // override cleartext with new hashed password
    login.password = hash;
    next();
  });
});

LoginSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

});

module.exports = mongoose.model('Login', LoginSchema);
