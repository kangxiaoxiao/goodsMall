var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/********************使用html作为模板引擎开始****************************/
var ejs=require("ejs");
/********************使用html作为模板引擎结束****************************/


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

/********************使用html作为模板引擎开始****************************/
app.engine(".html",ejs.__express);
app.set('view engine', 'html');
/********************使用html作为模板引擎结束****************************/


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//捕获登陆
let whiteList=["/users/login","/users/loginOut","/goods"]
app.use(function(req,res,next){
   if(req.cookies.userId){
     next();
   }else{
     if(whiteList.indexOf(req.path)==-1){
        res.json({
          status:"10001",
          msg:"当前未登陆",
          result:""
        })
     }else{
       next();
     }
   }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/cart', cartRouter);

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
