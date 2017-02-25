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

function Valid(obj) {
	var result = true;
	var novalid = ["notissubject", "pushfields"]
	for(key in obj) {
		if(!obj[key]) {
			result = false;
		}
		if(novalid.IsInArray(key) >= 0) result = true;
	}
	return result;
}

function StartTime(ts) {
	var seconds = new Date(ts).getSeconds();
	var timer = setInterval(function() {
		if(seconds == 0 || seconds == 60) {
			clearInterval(timer);
			Msg('您提交的Schedule，服务器已更新！', 's')
		}
		seconds += 1;
	}, 1000)
}

/* Controllers */
app.controller('BaseController', ['$scope', 'BaseService',
	function($scope, BaseService) {

		$scope.info = {};

		function BindEvent(isPageLoad) {
			$('select').material_select();
			$('textarea').trigger('autoresize');

			if(isPageLoad == 1) {
				$('.validate').each(function(index) {
					var next = $(this).next();
					$(this).off('focus');
					$(this).on('focus', function() {
						$(next).addClass('active');
						$(this).attr('placeholder', $(this).attr('ph'))
					})

					$(this).off('blur');
					$(this).on('blur', function() {
						if($(this).val().length == 0) {
							$(next).removeClass('active')
						}
						$(this).attr('placeholder', '')
					})
				})
			}
		}
		
		BindEvent();
	}
]);
