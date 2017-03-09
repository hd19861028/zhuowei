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

window.app.filter('dateformat', function() {
	return function(input, format) {
		var d = input || '';
		var f = format || 'yyyy-MM-dd HH:mm:ss';
		if(d) {
			d = new Date(d).ToFormatString(f);
			return d;
		} else
			return ''
	};
});

window.app.filter('status', function() {
	return function(input) {
		var d = input || '';
		var r = "";

		d == "Draft" && (r = "草稿");
		d == "Published" && (r = "已发布");
		d == "Canceled" && (r = "已撤销");
		d == "Completed" && (r = "已完成");

		return r;
	};
});

window.app.filter('hisStatus', function() {
	return function(input) {
		var d = input || '';
		var r = "";
		
		d == "New" && (r = "未处理");
		d == "Reviewed" && (r = "已处理");
		d == "Interviewed" && (r = "已面试");
		d == "Employed" && (r = "已录用");
		d == "Unemployed" && (r = "未录用");

		return r;
	};
});


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

var Screen = {
	/**
	 * 获取页面可视宽度
	 */
	ViewWidth: function() {
		var d = document;
		var a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientWidth;
	},
	/**
	 * 获取页面浏览器的真实宽度
	 */
	Width: function() {
		var g = document;
		var a = g.body;
		var f = g.documentElement;
		var d = g.compatMode == "BackCompat" ? a : g.documentElement;
		return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
	},
	/**
	 * 获取页面可视高度
	 */
	ViewHeight: function() {
		var d = document;
		var a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientHeight;
	},
	/**
	 * 获取页面浏览器的真实高度
	 */
	Height: function() {
		var g = document;
		var a = g.body;
		var f = g.documentElement;
		var d = g.compatMode == "BackCompat" ? a : g.documentElement;
		return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
	},
	/**
	 * 获取元素的绝对Y坐标
	 */
	Top: function(e) {
		try {
			var offset = e.offsetTop;
			if (e.offsetParent != null) offset += Screen.Top(e.offsetParent);
			return offset;
		} catch (e) {
			return -1;
		}
	},
	/**
	 * 获取元素的绝对X坐标
	 */
	Left: function(e) {
		var offset = e.offsetLeft;
		if (e.offsetParent != null) offset += Screen.Left(e.offsetParent);
		return offset;
	},
	/**
	 * 获取滚动条顶部距离页面顶部的高度
	 */
	ScrollBar: function() {
		var scrollPos;
		if (window.pageYOffset) {
			scrollPos = window.pageYOffset;
		} else if (document.compatMode && document.compatMode != 'BackCompat') {
			scrollPos = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollPos = document.body.scrollTop;
		}
		return scrollPos;
	}
}

/**
 * 扩展方法：日期类型格式化成指定格式的字符串形式，参数形式yyyy-MM-dd HH:mm:ss
 */
Date.prototype.ToFormatString = function(format) {
	var formatstr = format;
	if(format != null && format != "") {
		if(formatstr.indexOf("yyyy") >= 0) {
			formatstr = formatstr.replace("yyyy", this.getFullYear());
		}
		if(formatstr.indexOf("MM") >= 0) {
			var month = this.getMonth() + 1;
			if(month < 10) {
				month = "0" + month;
			}
			formatstr = formatstr.replace("MM", month);
		}
		if(formatstr.indexOf("dd") >= 0) {
			var day = this.getDate();
			if(day < 10) {
				day = "0" + day;
			}
			formatstr = formatstr.replace("dd", day);
		}
		var hours = this.getHours();
		if(formatstr.indexOf("HH") >= 0) {
			if(hours < 10) {
				hours = "0" + hours;
			}
			formatstr = formatstr.replace("HH", hours);
		}
		if(formatstr.indexOf("hh") >= 0) {
			if(hours > 12) {
				hours = hours - 12;
			}
			if(hours < 10) {
				hours = "0" + hours;
			}
			formatstr = formatstr.replace("hh", hours);
		}
		if(formatstr.indexOf("mm") >= 0) {
			var minute = this.getMinutes();
			if(minute < 10) {
				minute = "0" + minute;
			}
			formatstr = formatstr.replace("mm", minute);
		}
		if(formatstr.indexOf("ss") >= 0) {
			var second = this.getSeconds();
			if(second < 10) {
				second = "0" + second;
			}
			formatstr = formatstr.replace("ss", second);
		}
	}
	return formatstr;
}
