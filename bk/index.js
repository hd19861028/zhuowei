var request = require(global.m.common).request;
var q = Promise;
var bk = global.config.bk;

exports = module.exports;

var _header = {
	'Content-Type': 'application/json',
	'Pragma': 'no-cache',
	'Cache-Control': 'no-cache',
	'Expires': 0
};

function _get(u, key) {
	var d = q.defer();

	request.Get(u, _header).then(function(r) {
		console.log('路径')
		console.log(u)
		console.log('响应')
		console.log(r)

		if(r.status) {
			if(key) d.resolve(r.data[key]);
			else d.resolve(r.data);
		} else {
			d.reject(r.message);
		}
	}, function(err) {
		err.WriteLog();
		d.reject(err.message);
	})
	return d.promise;
}

function _post(u, p) {
	var d = q.defer();
	p = JSON.stringify(p);
	request.Post(u, p, _header).then(function(r) {
		console.log('路径')
		console.log(u)
		console.log('参数')
		console.log(p)
		console.log('响应')
		console.log(r)

		if(r.status) {
			d.resolve(r.data);
		} else {
			d.reject(r.message);
		}
	}, function(err) {
		err.WriteLog();
		d.reject(err.message);
	})

	return d.promise;
}

/**
 * @param {String} openid	
 * @returns	{"userID":"xxxx"}
 */
exports.WeiXinBinding = function(openid) {
	var p = bk + "/WeChatBinding/" + openid;
	return _post(p, {});
}

exports.WeiXinHasBinding = function(openid) {
	var p = bk + "/WeChatHasbinding/" + openid + "/";
	return _get(p);
}

exports.UseRegister = function(user) {
	var p = bk;
	if(user.HRUserID != undefined) {
		p += "/HRUseRegister"
	}
	if(user.UserID != undefined) {
		p += "/CandidateRegister"
	}
	return _post(p, user)
}

/**
 * @param {String} userid
 * @param {Number} type		大于0，则是求职者，没有值或者等于0，就是HR
 */
exports.UserInfo = function(userid, type) {
	var d = q.defer();
	var p = bk;
	var key = "hrUserInfor";
	if(type == 0 || type == undefined) {
		p += '/HRUserInfor/' + userid + "/";
	} else {
		key = "candidateInfor";
		p += '/CandidateInfor/' + userid + "/";
	}
	return _get(p, key);
}

exports.UserPhoneCheck = function(tel) {
	var p = bk + "/PhoneNumCheck/" + tel + "/";
	return _get(p);
}

exports.InfoList = function(pageSize, pageIndex) {
	var d = q.defer();
	var p1 = bk + "/InforList/" + pageSize + "/" + (pageIndex || 1) + "/"
	var k1 = "inforList";
	var p2 = bk + "/InforListCount/";
	var k2 = "inforListCount";
	var data = {}
	_get(p1, k1)
		.then(function(r) {
			data.data = r;
			return _get(p2, k2);
		})
		.then(function(r) {
			data.total = r;
			d.resolve(data);
		})
	return d.promise;
}

exports.InfoRecommend = function(infoId, userId, remark) {
	var p = bk + "/HRRecommend";
	var param = {
		"InforID": infoId,
		"HRUserID": userId,
		"RecmdTime": Date.now().Format('yyyy-MM-dd HH:mm:ss.fff'),
		"Remark": remark || ""
	}
	return _post(p, param);
}

exports.InfoHistory = function(userId, pageSize, pageIndex) {
	var d = q.defer();
	var p1 = bk + "/HRInforHistory/" + userId + "/" + pageSize + "/" + (pageIndex || 1) + "/"
	var k1 = "inforHistory";
	var p2 = bk + "/HRInforHistoryCount/" + userId;
	var k2 = "hrInforHistoryCount";
	var data = {}
	_get(p1, k1)
		.then(function(r) {
			data.data = r;
			return _get(p2, k2);
		})
		.then(function(r) {
			data.total = r;
			d.resolve(data);
		})
	return d.promise;
}