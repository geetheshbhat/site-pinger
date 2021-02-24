var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs= require('fs')
var cheerio=require('cheerio')
var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/users');
var cors = require('cors')
var monitor=require('./server/script/ping')
var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/server/public')));

app.use('/users', usersRouter);
app.use('/v1', indexRouter);
app.use(express.static(path.join(__dirname, 'dist'), {
  index: false
})); ///

app.get('/*', function (req, res) {
  var html = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf8');

  var $ = cheerio.load(html);

  res.send($.html());
});

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


app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

// module.exports = app;