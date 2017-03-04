var express = require(global.m.express);
var bk = require(global.m.bk);
var querystring = require('querystring');
var common = require(global.m.common).common;
var ws = require(global.m.common).weixin;

var app = express();

app.all('*', function(req, res) {
	console.log(res.locals)
	if(!res.locals.userId || !res.locals.openid) {
		res.send(403);
	} else
		req.next();
});

app.use('/user', require('./user/index'));
app.use('/info', require('./info/index'));

exports = module.exports = app;