
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()


var mhsRouter = require('./routes/mahasiswaRoute');
var adminRouter = require('./routes/adminRoute');
var kaprodiRouter = require('./routes/kaprodiRoute');
var authRouter = require('./routes/authRoute');
const methodOverride = require('method-override')



var app = express();

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



app.use('/mahasiswa', mhsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/kaprodi', kaprodiRouter);


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

