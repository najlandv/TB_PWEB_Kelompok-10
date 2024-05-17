// const express = require('express');
// const path = require('path');
// const app = express();

// app.set('view engine','ejs');
// app.set('views',[path.join(__dirname,'/views')]);
// app.use(express.static(path.join(__dirname,'/assets')));
// app.use(express.static(path.join(__dirname,'/node_modules/preline/dist')));



// app.get('/', (req, res) => {
//   res.render('index')
// });

//   app.get('/login', (req, res) => {
//     res.render('login')
//   });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log('Server berjalan di http://localhost:${PORT}');
// });

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()




// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var mhsRouter = require('./routes/mahasiswaRoute');
var adminRouter = require('./routes/adminRoute');
var kaprodiRouter = require('./routes/kaprodiRoute');
var authRouter = require('./routes/authRoute');
const methodOverride = require('method-override')



var app = express();
// app.use(publicRoutes);
app.use(methodOverride('_method'))



// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('login')
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// app.use('/', indexRouter);
// app.use('/users', usersRouter);


app.use('/mahasiswa', mhsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/kaprodi', kaprodiRouter);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);

});

