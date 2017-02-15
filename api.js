var express = require(global.m.express);
var compress = require(global.m.compression);

var app = express();

app.use(compress()); 
app.use(express.static(global.config.static))

app.all('*', function(req, res) {
	req.next();
});

app.use('/api', require('./api/index'));

if (global.config.port && global.config.port > 0) {
	app.listen(global.config.port);
	WriteLog('web站点已启动，端口：' + global.config.port)
}