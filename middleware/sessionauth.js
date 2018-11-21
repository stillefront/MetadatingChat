const {User} = require('../models/user');

function sessionauth(req, res, next) {
    console.log(sess.userId);
    //console.log(session);
    if (!sess.userId) return res.status(403).send('Access denied. Not logged in!');

    try {
    User.findById(sess.userId);
    next();
    }

    catch (ex) {
        res.status(400).send('Invalid Request.');
    }
}

module.exports = sessionauth;