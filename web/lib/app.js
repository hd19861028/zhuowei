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

app.directive('pagination', function() {
	return {
		restrict: 'EA',
		replace: true,
		priority: 0,
		require: '?ngModel',
		//transclude: true,
		scope: false,
		link: function(scope, ele, attrs, model) {
			scope.page_size = attrs.size ? attrs.size : 10;
			scope.total_count = attrs.total ? attrs.total : 0;
			scope.callback = attrs.method ? attrs.method : null;

			if (scope.total_count) {
				var max_page = Math.floor(scope.total_count / scope.page_size);
				if (scope.total_count % scope.page_size > 0) {
					max_page += 1;
				}
				scope.active_page_index = 1;
				scope.max_page_index = max_page;
			}

			scope.$on("total_change", function(d, total) {
				scope.active_page_index = 1;
				scope.max_page_index = Math.ceil(total / scope.page_size);
			})

			scope.process = function(index) {
				var success = function(all) {
					scope.active_page_index = index;
					scope.max_page_index = Math.ceil(all / scope.page_size);
				}

				var error = function(error) {
					//处理错误
				}

				var callback = scope[scope.callback];
				callback(index, scope.page_size, success, error);
			}
			scope.process(1);

			return {
				pre: function(tElement, tAttrs, transclude) {
					// 在子元素被链接之前执行
					console.log("pre")
				},
				post: function(scope, iElement, iAttrs, controller) {
					// 在子元素被链接之后执行
					console.log("post")
				}
			}
		},
		templateUrl: '/template/pagination.html'
	};
});