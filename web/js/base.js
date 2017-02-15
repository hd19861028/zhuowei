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

		function GetFields() {
			var fields = [];
			$('#fields input').each(function(index) {
				var value = $(this).val();
				var checked = $(this).prop('checked');
				if(checked) {
					fields.push(value)
				}
			})
			return fields.join(',')
		}

		function SearchES(name, isPageLoad) {
			BaseService.search(name, isPageLoad)
				.then(function(d) {
					if(d.status) {
						var r = d.info;
						r.id = d.id;
						if(r.query) {
							r.query = JSON.stringify(JSON.parse(r.query), null, 4)
						}
						$scope.info = r;
						$scope.IndexChange();
						setTimeout(function() {
							BindEvent(isPageLoad)
						}, 300)
					} else {
						Msg('找不到任何schedule');
					}
				});
		}
		SearchES(null, 1);

		$scope.selected = [];
		$scope.showNames = false;
		BaseService.names()
			.then(function(names) {
				$scope.names = names;
			})

		$scope.Search = function() {
			SearchES($scope.info.name)
		}

		$scope.ChangeName = function() {
			var input = $scope.info.name;
			var selected = [];
			for(var i = 0; i < $scope.names.length; i++) {
				if($scope.names[i].indexOf(input) >= 0) {
					selected.push($scope.names[i])
				}
			}
			$scope.selected = selected;
			$scope.showNames = true;
		}

		$scope.SelectOneName = function(n) {
			$scope.info.name = n;
			$scope.Search();
			$scope.showNames = false;
		}

		$scope.IndexChange = function() {
			var selected = ($scope.info.pushfields || '').split(',');
			if($scope.info.indexname.length > 0) {
				BaseService.fields($scope.info.indexname)
					.then(function(d) {
						var fields = [];
						for(var i = 0; i < d.fields.length; i++) {
							var item = {
								name: d.fields[i],
								active: selected.IsInArray(d.fields[i]) >= 0
							}
							fields.push(item)
						}
						$scope.fields = fields;
					})
			}
		}

		$scope.ShowModal = function() {
			if($scope.info.name) {
				$('#modal').openModal();
			} else {
				Msg('尚未填写【监控名称】')
			}
		}

		$scope.HideModal = function() {
			$('#modal').closeModal();
		}

		$scope.Submit = function() {
			$scope.info.pushfields = GetFields();

			if(Valid($scope.info)) {
				BaseService.submit($scope.info)
					.then(function(d) {
						if(d.status) {
							StartTime(d.ts);
							Msg(d.msg, 's')
						} else {
							Msg(d.msg, 'e', 6)
						}
					})
			} else {
				Msg('表单中每个字段都是必填的，请认真填写')
			}
		}

		$scope.Delete = function() {
			BaseService.del($scope.info.name)
				.then(function(d) {
					if(d.status) {
						Msg(d.msg, 's');
						$scope.HideModal()
					} else {
						Msg(d.msg, 'e', 6)
					}
				})
		}

	}
]);

/* Controllers */
app.controller('ConfigController', ['$scope', 'BaseService',
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
		BindEvent(1);

		$scope.cfg = "";
		$scope.isStart = false;
		
		BaseService.cfg().then(function(cfg) {
			$scope.cfg = JSON.stringify(cfg, null, 4);
			setTimeout(function() {
				BindEvent()
			}, 300)
		})

		$scope.Submit = function() {
			//console.log($scope.cfg)
			//console.log($scope.isStart)
			BaseService.cfgSave($scope.cfg, $scope.isStart).then(function(cfg) {})
		}

	}
]);