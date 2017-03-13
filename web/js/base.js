/* Controllers */
app.controller('BaseController', ['$scope', 'BaseService',
	function($scope, db) {

		$scope.info = {};
		$scope.pageSize = 6;

		$('body').addClass('body-show');
		$('select').material_select();
		$('textarea').trigger('autoresize');

		var sex = function(sex) {
			var r = "";
			sex == "male" && (r = "男");
			sex == "female" && (r = "女");
			return r;
		}

		var status = function(s) {
			var r = "";
			s == "New" && (r = "认证中");
			s == "Verified" && (r = "已认证");
			s == "Disable" && (r = "已禁用");
			return r;
		}

		$scope.UserInfo = function(type, isInfoPage) {
			type = type || 0;
			var user = Session.Get('user' + type);
			if(user) {
				$scope.user = JSON.parse(user)
			} else {
				db.user.info(type).then(function(r) {
					r.gender != undefined && (r.sex = sex(r.gender));
					r.status != undefined && (r.statusName = status(r.status));

					Session.Set('user' + type, JSON.stringify(r));
					if(r.status != undefined && r.status != "Verified" && isInfoPage == undefined) {
						window.location.href = "hr-info.html";
					}
					$scope.user = r;
				})
			}

		}

		$scope.FormatHtml = function(str) {
			str = str || "";
			return str.replace(/\n/ig, '<br>').replace(/\t/ig, '&emsp;').replace(/ /ig, '&nbsp;');
		}

	}
]);

app.controller('HRBindController', ['$scope', 'BaseService',
	function($scope, db) {
		var rurl = GetUrlParam('rurl');

		$scope.user = { type: 0 };

		$scope.Save = function() {
			var item = $scope.user;
			console.log(item)
			if(!item.name) {
				MsgError('请输入姓名')
				return;
			}
			if(!item.tel) {
				MsgError('请输入手机号')
				return;
			}
			if(!item.sex) {
				MsgError('必须选择性别')
				return;
			}

			db.user.register(item).then(function(r) {
				MsgSuccess("注册成功", function() {
					window.location.href = "hr-info.html";
				});
			})
		}

	}
]);

app.controller('HRInfoController', ['$scope', 'BaseService',
	function($scope, db) {

		$scope.UserInfo(0, true);

		$scope.LinkTo = function(t) {
			var page = "";
			t == 1 && (page = "hr-tuijian.html");
			t == 2 && (page = "hr-history.html");
			if($scope.user.status == "Verified") {
				window.location.href = page;
			}
		}

	}
]);

app.controller('InfoListController', ['$scope', '$window', 'BaseService',
	function($scope, $window, db) {

		$scope.SelectedItem = null;

		$('.modal-trigger').leanModal({
			dismissible: true
		});

		$scope.ConfirmToSubmit = function() {
			var _item = angular.copy($scope.SelectedItem)
			db.info.recommend(_item).then(function(r) {
				MsgSuccess("推荐成功");
				$('#modal1').closeModal();
				$scope.List(1);
			}, function() {});

		}

		$scope.Cancel = function() {
			$('#modal1').closeModal();
		}

		$window.onscroll = function() {
			var height = Screen.ScrollBar() + Screen.ViewHeight();
			var totalheight = Screen.Height();

			if(height >= totalheight) {
				if($scope.pageIndex < $scope.maxPage && $scope.maxPage != 0) {
					Loading(true);
					$scope.pageIndex += 1;
					console.log('onscroll', $scope.pageIndex)
					$scope.List($scope.pageIndex);
				}
			}
		}

		$scope.List = function(index) {
			$scope.pageIndex = index;
			db.info.list($scope.pageSize, $scope.pageIndex)
				.then(function(r) {
					for(var i = 0; i < r.data.length; i++) {
						r.data[i].description = $scope.FormatHtml(r.data[i].description)
						r.data[i].remarks = $scope.FormatHtml(r.data[i].remarks)
					}
					if(index == 1)
						$scope.infos = r.data;
					else {
						for(var i = 0; i < r.data.length; i++) {
							$scope.infos.push(r.data[i])
						}
					}
					$scope.total = r.total;
					$scope.maxPage = Math.ceil($scope.total / $scope.pageSize);
				});
		}
		$scope.List(1);

		$scope.Recommend = function(item) {
			$scope.SelectedItem = item;
			$('#modal1').openModal();
		}

	}
]);

app.controller('HistoryListController', ['$scope', '$window', 'BaseService',
	function($scope, $window, db) {

		$window.onscroll = function() {
			var height = Screen.ScrollBar() + Screen.ViewHeight();
			var totalheight = Screen.Height();

			if(height >= totalheight) {
				if($scope.pageIndex < $scope.maxPage && $scope.maxPage != 0) {
					Loading(true);
					$scope.pageIndex += 1;
					console.log('onscroll', $scope.pageIndex)
					$scope.List($scope.pageIndex);
				}
			}
		}

		$scope.List = function(index) {
			$scope.pageIndex = index;
			db.info.history($scope.pageSize, $scope.pageIndex)
				.then(function(r) {
					for(var i = 0; i < r.data.length; i++) {
						r.data[i].description = $scope.FormatHtml(r.data[i].description)
						r.data[i].remarks = $scope.FormatHtml(r.data[i].remarks)
					}
					if(index == 1)
						$scope.infos = r.data;
					else {
						for(var i = 0; i < r.data.length; i++) {
							$scope.infos.push(r.data[i])
						}
					}
					$scope.total = r.total;
					$scope.maxPage = Math.ceil($scope.total / $scope.pageSize);
				});
		}
		$scope.List(1);

	}
]);
