var querystring = require('querystring');
var Secret = require(global.m.common).secret;
var secret = new Secret();

exports = module.exports;

exports.cookieParse = function(req, res, next) {

	req.cookies = function(key) {
		var cookie = querystring.parse(req.headers.cookie, '; ');
		var result = cookie[key];
		return result ? result : null;
	}

	req.cookiesSafe = function(key) {
		var value = req.cookies(key);
		return value ? secret.Unsign(value) : "";
	}

	res.setCookies = function(key, value, timeout) {
		timeout = timeout && timeout > 0 ? timeout : 0;
		var options = {
			httpOnly: true,
			path: '/'
		};
		if (value) {
			if (timeout > 0) {
				timeout += 28800000;
				options.maxAge = timeout;
			}
			res.cookie(key, value, options);
		} else {
			res.clearCookie(key, options);
		}
	}

	res.setCookiesSafe = function(key, value, timeout) {
		value = value ? secret.Sign(value) : "";
		res.setCookies(key, value, timeout);
	}

	next();
}