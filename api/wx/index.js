var express = require(global.m.express);
var weixin = require(global.m.common).weixin;
var common = require(global.m.common).common;
var request = require(global.m.common).request;
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var q = Promise;
var config = global.config.website;

var app = express();

app.post('/', function(req, res) {
	var result = "";
	
	req.on('data', function(chunk) {
		result += chunk.toString();
	});
	req.on('end', function() {
		//console.log("----------------原xml-------------------")
		//console.log(result)
		common.xmlToJson(result, function(json) {
			//console.log("----------------解析后-------------------")
			//console.log(json);
			var reply = weixin.process_msg(json, res);

			if(json.Event == "unsubscribe") {
				var openid = res.locals.openid;

			} else {
				res.type(".xml");
				res.send(reply);
			}
		})

	});
});

app.get('/', function(req, res) {
	console.log(req.query)
	var domain = config.domain;
	var web = 'http://' + domain + '/';
	var date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	res.set({
		'Expires': date,
		'Content-Type': 'application/json'
	});
	var result = weixin.validateToken(req.query);
	res.end(result);
});

app.get('/redirect', function(req, res) {
	var domain = config.domain;
	var web = 'http://' + domain + '/';
	var state = req.query.state;
	var openid = res.locals.openid;
	var suc_url = "";
	var bind_url = web + 'hr-bind.html?rurl=';
	state == "s1" && (suc_url = web + "hr-tuijian.html");
	state == "s2" && (suc_url = web + "hr-history.html");
	state == "s3" && (suc_url = web + "hr-info.html");
	state == "s4" && (suc_url = web + "qiuzhi-info.html");
	bind_url += encodeURIComponent(suc_url);

	if(openid) {
		console.log('openid1 --> ' + openid);
		res.redirect(suc_url);
	} else {
		var code = req.query.code;
		var appid = config.appid;
		var secret = config.secret;
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
		request.Get(url, {})
			.then(function(msg) {
				if(msg && msg.openid) {
					console.log('openid2 --> ' + openid);
					res.setCookiesSafe(global.ckey.openid, msg.openid, config.openid_expire);
					res.redirect(suc_url);
				} else {
					res.send(msg);
				}
			}, function(err) {
				console.error("/weixin/index.js --> line: 119")
				console.error(err)
			})
	}

});

app.post('/notification', function(req, res) {
	var result = "";
	var data = {}
	
	req.on('data', function(chunk) {
		result += chunk.toString();
	});
	req.on('end', function() {
		var template = null;
		try {
			template = JSON.parse(result);
			weixin.push_notise(template.openid, template.templateid, template.data, template.backurl)
				.then(function(msg) {
					if(msg == "") {
						data.status = true;
						data.msg = "发送成功";
					} else {
						data.status = false;
						data.msg = msg.stack || msg;
					}
					res.json(data);
				}).catch(function(e) {
					console.log(e)
					data.status = false;
					data.msg = msg.stack || msg;
					res.json(data);
				})
		} catch(e) {
			data.status = false;
			data.msg = "无效的json格式";
			res.json(data);
		}
	});
});

exports = module.exports = app;