var express = require(global.m.express);
var querystring = require('querystring');
var common = require(global.m.common).common;
var ws = require(global.m.common).weixin;

var app = express();

exports = module.exports;

app.get('/jsapi_ticket', function(req, res) {
	var path = req.query.path;
	path = decodeURIComponent(path);

	ws.get_jsapi_ticket(path)
		.then(function(ticket) {
			res.json(ticket);
		}, function(err) {
			console.error(err)
			res.json(err);
		}).catch(function(error) {
			if (error) {
				console.error(error)
				res.json(error);
			}
		});
});

app.get('/access_token', function(req, res) {

	ws.get_access_token()
		.then(function(token) {
			res.json({
				token: token
			});
		}, function(err) {
			console.error(err)
			res.json(err);
		})
		.catch(function(error) {
			if (error) {
				console.error(error)
				res.json(error);
			}
		});
});

exports = module.exports = app;