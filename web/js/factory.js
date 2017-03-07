app.factory('BaseService', ['$q', '$http',
	function($q, $http) {

		var apibase = "/api/web"
		var _api = {
			user: {
				base: apibase + '/user',
				register: function(user) {
					return _post(this.base + '/register', user)
				},
				info: function(type) {
					return _get(this.base + '/info', { type: type })
				}
			},
			info: {
				base: apibase + '/info',
				recommend: function(param) {
					return _post(this.base + '/recommend', param)
				},
				list: function(size, index) {
					return _get(this.base + '/list', { size: size, index: index })
				},
				history: function(size, index) {
					return _get(this.base + '/history', { size: size, index: index })
				}
			}
		};

		var _header = {
			headers: {
				'Content-Type': 'application/json'
			},
			timeout: 15000
		}

		var _post = function(url, data) {
			Loading(true);
			var d = $q.defer();

			$http.post(url, JSON.stringify(data), _header)
				.success(function(r, statusCode) {
					if(r.status) {
						d.resolve(r.data);
					} else {
						MsgError(r.message);
					}
				})
				.error(function(err, status) {
					Loading(false);
					MsgError(err);
				})
			return d.promise;
		}

		var _get = function(url, data) {
			Loading(true);
			data = data || {};
			data.t = Math.random();
			if(data) {
				for(var k in data) {
					if(data[k] === '') delete data[k]
				}
			}
			var d = $q.defer();
			var _param = {
				method: 'get',
				url: url,
				responseType: 'json',
				params: data
			};
			angular.extend(_param, JSON.parse(JSON.stringify(_header)));
			$http(_param)
				.success(function(r, statusCode) {
					if(r.status) {
						d.resolve(r.data);
					} else {
						MsgError(r.message);
					}
				})
				.error(function(err, status) {
					Loading(false);
					MsgError(err);
				})
			return d.promise;
		}

		return _api;
	}
]);