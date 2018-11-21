const {User} = require('../models/user');
const session = require('express-session');

async function auth(req, res, next) {
    if (!req.session.userId) { 
        res.redirect('/login');
        console.log("hier");
    }
    try {
    User.findById(req.session.userId);
    next();
    }

    catch (ex) {
        res.redirect('/login');
        console.log("oder da");
    }
}

module.exports = auth;