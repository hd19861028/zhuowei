var express = require(global.m.express);
var bk = require(global.m.bk);
var querystring = require('querystring');
var common = require(global.m.common).common;
var ws = require(global.m.common).weixin;

var app = express();

app.post('/recommend', function(req, res) {
	var result = "";
	req.on('data', function(chunk) {
		result += chunk.toString();
	});
	req.on('end', function() {
		var query = JSON.parse(result);
		var data = {};

		bk.InfoRecommend(query.inforID, res.locals.userId, query.remark || '')
			.then(function(r) {
				res.json({ status: true })
			}, function(e) {
				res.json({ status: false, message: e })
			})
	})
});

app.get('/list', function(req, res) {
	bk.InfoList(req.query.size, req.query.index)
		.then(function(r) {
			res.json({ status: true, data: r })
		}, function(e) {
			res.json({ status: false, message: e })
		})
});

exports = module.exports = app;