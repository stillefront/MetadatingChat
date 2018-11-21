//check for cookies without session and delte them
function sessionCheck(req, res, next) {
    if (req.cookie.user_session && !req.session.userId) {
        res.clearCookie('user_session')
    } 
    next();    
}

module.exports = sessionCheck;