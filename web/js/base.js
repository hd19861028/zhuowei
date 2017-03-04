/* Controllers */
app.controller('BaseController', ['$scope', 'BaseService',
	function($scope, db) {

		$scope.info = {};
		$scope.pageSize = 10;

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
				MsgSuccess("注册成功");
				if(rurl) {
					window.location.href = "hr-info.html";
				}
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

app.controller('InfoListController', ['$scope', 'BaseService',
	function($scope, db) {

		$scope.List = function(index) {
			$scope.pageIndex = index;
			db.info.list($scope.pageSize, $scope.pageIndex)
				.then(function(r) {
					console.log(r)
					console.log(typeof r)
					$scope.infos = r.data;
					$scope.total = r.total;
				});
		}
		$scope.List(1);

		$scope.Recommend = function(item) {
			db.info.Recommend(item)
				.then(function(r) {
					MsgSuccess("推荐成功");
					$scope.List(1);
				});
		}

	}
]);