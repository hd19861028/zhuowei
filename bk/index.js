var request = require(global.m.common).request;
var q = Promise;

exports = module.exports;

exports.UserBinding = function(openid) {
	var d = q.defer();
	d.resolve(null)
	return d.promise;
}

exports.GetUserInfo = function(openid) {
	var d = q.defer();
	d.resolve(null)
	return d.promise;
}