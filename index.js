'use strict';

function LoadConfig(cfg) {
	var c = fs.readFileSync(cfg, 'utf8');
	var from = c.indexOf('/**');
	while(from >= 0) {
		var to = c.indexOf('**/');
		c = c.substr(0, from) + c.substr(to + 3, c.length);
		from = c.indexOf('/**');
	}
	return JSON.parse(c);
}

var fs = require('fs');
var path = require('path');
var config = LoadConfig('./config.json');

config.root = __dirname;
fs.mkdir('log', function() {})

var globalModulePath = config.modulePath;
config.static = './web'

global.config = config;

global.m = {
	"common": globalModulePath + "wx-common",
	"compression": globalModulePath + "compression",
	"q": globalModulePath + "q",
	"express": globalModulePath + "express"
}

global.ckey = {
	"memberid": "memberid",
	"openid": "openid"
}

require(global.m.common).prototype;

require('./api');