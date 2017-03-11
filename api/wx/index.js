var express = require(global.m.express);
var weixin = require(global.m.common).weixin;
var common = require(global.m.common).common;
var request = require(global.m.common).request;
var bk = require(global.m.bk);
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
	var type = 1; //0：hr，1：求职者
	var openid = res.locals.openid;
	var suc_url = "";
	var bind_url = web + 'hr-bind.html?rurl=';
	state == "s1" && (suc_url = web + "hr-tuijian.html", type = 0);
	state == "s2" && (suc_url = web + "hr-history.html", type = 0);
	state == "s3" && (suc_url = web + "hr-info.html", type = 0);
	state == "s4" && (suc_url = web + "qiuzhi-info.html");
	bind_url += encodeURIComponent(suc_url);

	var getUserInfo = function(oid) {
		return bk.WeiXinBinding(oid)
			.then(function(r) {
				console.log(r)
				res.setCookies(global.ckey.userid, r.userID, config.openid_expire);
				res.setCookiesSafe(global.ckey.openid, oid, config.openid_expire);
				return bk.UserInfo(r.userID, type)
			})
			.then(function(r) {
				console.log(r)
				if(r.status != undefined) {
					//https://api.weixin.qq.com/cgi-bin/user/info?access_token=&openid=&lang=zh_CN
					//如果用户是HR，根据status状态判断当前是否已审批
					//审批通过：成功页
					if(r.status == "Verified") {
						res.redirect(suc_url);
					}
					//未审批：我的信息页
					if(r.status == "New") {
						res.redirect(web + "hr-info.html");
					}
					//禁用：我的信息页
					if(r.status == "Disable") {
						res.redirect(web + "hr-info.html");
					}
				} else //如果没有状态字段，用户是求职者，直接跳到成功页
					res.redirect(suc_url);
			}, function(e) {
				res.redirect(bind_url);
			});
	}

	if(openid) {
		getUserInfo(openid);
	} else {
		var code = req.query.code;
		var appid = config.appid;
		var secret = config.secret;
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
		request.Get(url, {})
			.then(function(msg) {
				if(msg && msg.openid) {
					getUserInfo(msg.openid);
				} else {
					res.send(msg);
				}
			}, function(err) {
				err.WriteLog();
				res.send(err.message);
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
			if(typeof template.data == "string"){
				template.data = JSON.parse(template.data);
			}
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