var config = require('../webpack.config');
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var user = require('./routes/user');
var chatRoute = require('./routes/chat');
var common = require('./routes/common');
var post = require('./routes/post');
var article = require('./routes/article');
var platform = require('os').platform();

var app = express();
var host = platform === 'win32' ? 'localhost' : '106.14.58.33';
var port = platform === 'win32' ? 3000 : 80;

// // 引入redis
// var redis = require('redis'),
//     RDS_PORT = 6379,
//     RDS_HOST = '127.0.0.1',
//     RDS_PWD  = 'abc369188',
//     RDS_OPTS = {auth_pass: RDS_PWD},
//     client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

// client.on('ready', function (res) {
//     console.log('ready');
// });
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'love',
  name: 'pageSeesion'
}));
// app.use('/', function(req, res, next) {
//   req.client = client;
//   next();
// })
app.use(express.static('./dist'));
app.use('/user', user);
app.use('/common', common);
app.use('/post', post);
app.use('/article', article);
app.use('/chat', chatRoute);
app.get("/", function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(port, host,function(error) {
  if (error) {
    console.error(error)
  } else {
    console.log("Express server listening on port", port);
  }
});
