const {User} = require('../models/user');
const session = require('express-session');

async function auth(req, res, next) {
    if (!req.session.userId) { 
        return res.redirect('/login');
    } 
    
    try {
    User.findById(req.session.userId);
    next();
    }

    catch (ex) {
        res.redirect('/login');
    }
}

module.exports = auth;