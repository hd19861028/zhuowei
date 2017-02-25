var express = require(global.m.express);
var compress = require(global.m.compression);

var app = express();

app.use(compress()); 
app.use(express.static(global.config.static))

var middleware = require('./middleware')
app.use(middleware.cookieParse);

app.all('*', function(req, res) {
	
	res.locals.memberid = req.cookies(global.ckey.memberid);
	res.locals.openid = req.cookiesSafe(global.ckey.openid);
	
	req.next();
});

app.use('/api', require('./api/index'));

if (global.config.port && global.config.port > 0) {
	app.listen(global.config.port);
	WriteLog('web站点已启动，端口：' + global.config.port)
}