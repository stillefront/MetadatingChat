const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const session = require('express-session');


const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const adminRouter = require('./routes/admin');
const updateRouter = require('./routes/update');
const deleteRouter = require('./routes/delete');
const botRouter = require('./routes/bots');
const chatRouter = require('./routes/chat');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const login = require('./routes/login');

const app = express();

// change the following for a proper session secret in backend?
if (!config.get('PrivateKeyjwt')) {
  console.error('FATAL ERROR: PrivateKeyjwt is not defined.');
  process.exit(1);
}

// use sessions for tracking logins
app.use(session({
  secret: 'sicherheitsluecke',
  resave: true,
  saveUninitialized: false

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

app.use('/', indexRouter);
app.use('/bots', botRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);
app.use('/register', registerRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/login', login);

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

module.exports = app;

// export metadating_PrivateKeyjwt=sicheresPasswort
