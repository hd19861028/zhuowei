var express = require(global.m.express);
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var q = Promise;

var app = express();

app.get('/gc', function(req, res) {
	if(global.gc) {
		global.gc();
		res.send('gc成功！');
	} else {
		res.send('当前环境不支持gc函数')
	}
})

app.get('/pm2', function(req, res) {
	var cmd = req.query.cmd || '';
	var timeout = req.query.timeout || 5000;

	cmd = cmd.toLowerCase();
	var cannot = ['--kill-timeout', '--execute-command', '-x', 'stop', 'delete', 'kill', '-k'];
	var hasPermission = true;
	for(var i = 0; i < cannot.length; i++) {
		if(cmd.indexOf(cannot[i]) >= 0) {
			hasPermission = false;
		}
	}
	if(hasPermission == false) {
		res.send(403)
	} else {
		exec('pm2 ' + cmd, {
			timeout: timeout
		}, function(error, stdout, stderr) {
			var output = "";
			if(stdout)
				output = stdout.replace(/\n/ig, '<br>').replace(/\t/ig, '&emsp;').replace(/ /ig, '&nbsp;');
			else
				output = stderr
			res.send(output)
		});
	}
});

exports = module.exports = app;