const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const session = require('express-session');
const formidable = require('formidable');

const socket = require ('./controller/socket');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const adminRouter = require('./routes/admin');
const updateRouter = require('./routes/update');
const deleteRouter = require('./routes/delete');
const botRouter = require('./routes/bots');
const fetchRouter = require('./routes/fetch');
const chatRouter = require('./routes/chat');
const chatstartRouter = require('./routes/chatstart'); // new shit
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const apittsrouter = require('./routes/api_tts');

const login = require('./routes/login');
const logout = require('./routes/logout');

//const sessionCheck = require('../middleware/sessionCheck');

const app = express();

// socket.io serverside integration
const server = require('http').Server(app);
const io = require('socket.io')(server);
socket(io);


/*
app.io = require('socket.io')();
socket(app.io); // connecting socket.io to the app
*/



// change the following for a proper session secret in backend?
if (!config.get('PrivateKey')) {
  console.error('FATAL ERROR: PrivateKey is not defined.');
  process.exit(1);
}

// use sessions and cookies for tracking logins
const privateKey = config.get('PrivateKey');

app.use(session({
  key: 'user_session',
  secret: privateKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    domain: 'localhost'
  }

}));



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/botDB')
  .then(function(){
    console.log('Connected to MongoDB');
  })
  .catch(function(err){
    console.error('Could not connect to MongoDB');
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route to bot static pictures
app.use('*/uploads', express.static('uploads'));

//check for cookies without session and delete them, put it into middleware folder!

app.use((req, res, next) => {
  if (req.cookies.user_session && !req.session.userId) {
      res.clearCookie('user_session');
      console.log("cookie cleared");        
  }
  next();
});



app.use('/', indexRouter);
app.use('/bots', botRouter);
app.use('/fetch', fetchRouter);
app.use('/chat', chatRouter);
app.use('/chatstart', chatstartRouter);
app.use('/admin', adminRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);
app.use('/register', registerRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/login', login);
app.use('/logout', logout);
app.use('/api/tts', apittsrouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = {app: app, server: server};
//module.exports = app;

// export metadating_PrivateKey=sicheresPasswort
