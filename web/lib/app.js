window.app = angular.module('app', []);

window.app.config(['$sceProvider', '$httpProvider',
	function($sceProvider, $httpProvider) {
		$sceProvider.enabled(false);

		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
		$httpProvider.defaults.headers.put['Content-Type'] = 'multipart/form-data;charset=utf-8';
		$httpProvider.defaults.transformRequest = [
			function(data) {
				data = angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
				return data;
			}
		];
	}
]);

function Loading(isshow, msg) {
	var loading = document.getElementsByClassName('wx_loading')[0];
	loading && loading.parentNode && loading.parentNode.removeChild(loading);

	msg = msg ? msg : "页面加载中...";
	if(isshow) {
		var div = document.createElement('div');
		div.setAttribute('class', 'wx_loading');
		div.setAttribute('id', 'wxloading');
		div.innerHTML = '<div class="wx_loading_inner"><i class="wx_loading_icon"></i>' + msg + '</div>';
		document.body.appendChild(div);
	} else {
		loading && loading.parentNode && loading.parentNode.removeChild(loading);
	}
}

var Cookies = {
	Get: function(key) {
		var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	Set: function(key, value, days, hours, minutes, seconds) {
		var Days = (days > 0) ? days : 30;
		var Hours = (hours > 0) ? hours : 0;
		var Minutes = (minutes > 0) ? minutes : 0;
		var Seconds = (seconds > 0) ? seconds : 0;

		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000 + Hours * 60 * 60 * 1000 + Minutes * 60 * 1000 + Seconds * 1000);
		document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
	},
	Del: function(key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(key);
		if(cval != null)
			document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

window.Session = {
	Set: function(key, value) {
		window.sessionStorage.setItem(key, value);
	},
	Get: function(key) {
		return window.sessionStorage.getItem(key);
	},
	Del: function(key) {
		window.sessionStorage.removeItem(key);
	},
	Clear: function() {
		window.sessionStorage.clear();
	}
}

window.Local = {
	Set: function(key, value) {
		window.localStorage.setItem(key, value);
	},
	Get: function(key) {
		return window.localStorage.getItem(key);
	},
	Del: function(key) {
		window.localStorage.removeItem(key);
	},
	Clear: function() {
		window.localStorage.clear();
	}
}

function GetUrlParam(name) {
	try {
		var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
		var r = window.location.search.toLowerCase().substr(1).match(reg);
		if(r != null) return unescape(r[2]).replace(/</, "&lt;").replace(/>/, "&gt;");
		return "";
	} catch(e) {

	}
}

function DefaultError(err) {
	Msg('服务器正忙，请重试！')
}

Array.prototype.IsInArray = function(n) {
	var index = -1;
	for(var i = 0; i < this.length; i++) {
		if(this[i] == n) {
			index = i;
		}
	}
	return index;
}

function Msg(msg, type, callbackFun, time) {
	if(!time) {
		time = 3 * 1000;
	} else {
		time = time * 1000;
	}
	type = type ? type : 'e'
	if($(".msgtips").length > 0) {
		$(".msgtips").remove();
	}

	var strinner = "<div class='msgtips " + type + "'>" + msg + "</div>";
	$(document.body).append(strinner);
	var timer = setTimeout(function() {
		var t = document.querySelector(".msgtips");
		$(t).addClass("out");
		t.addEventListener("animationend", function() { //动画结束时事件
			$(t).remove();
			$.isFunction(callbackFun) ? callbackFun() : $.noop;
		}, false);
		clearTimeout(timer);
	}, time);
}

function MsgSuccess(msg, callback) {
	Msg(msg, 's', callback, 1)
	Loading(false);
}

function MsgError(msg, callback) {
	Msg('(ㄒㄒ) ' + msg, 'e', callback, 3);
	Loading(false);
}