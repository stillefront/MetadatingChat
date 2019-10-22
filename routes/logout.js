var express = require('express');
var router = express.Router();


/* Route for logout */
router.get('/', function(req, res, next) {
    if (req.session.userId && req.cookies.user_session) {
        res.clearCookie('user_session');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;