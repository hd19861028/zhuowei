var express = require(global.m.express);
var bk = require(global.m.bk);
var querystring = require('querystring');
var common = require(global.m.common).common;
var ws = require(global.m.common).weixin;

var app = express();

app.post('/register', function(req, res) {
	var result = "";
	req.on('data', function(chunk) {
		result += chunk.toString();
	});
	req.on('end', function() {
		var query = JSON.parse(result);
		var data = {};
		if(query.type == 0) {
			data = {
				"HRUserID": res.locals.userId,
				"Name": query.name,
				"Phone": query.tel,
				"Gender": query.sex,
				"Remarks": query.remark || ""
			}
		} else {
			data = {
				"UserID": res.locals.userId,
				"UserName": query.name,
				"Mobile": query.tel,
				"WrokYear": query.years,
				"Technology": query.technology,
				"Salary": query.salary
			}
		}

		bk.UserPhoneCheck(req.tel)
			.then(function(r) {
				return bk.UseRegister(data);
			}, function(e) {
				res.json({ status: false, message: e })
			})
			.then(function(r) {
				res.json({ status: true })
			}, function(e) {
				res.json({ status: false, message: e })
			})
	})
});

app.get('/info', function(req, res) {
	bk.UserInfo(res.locals.userId, req.query.type)
		.then(function(r) {
			res.json({ status: true, data: r })
		}, function(e) {
			res.json({ status: false, message: e })
		})
});

exports = module.exports = app;