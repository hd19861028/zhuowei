app.factory('BaseService', ['$q', '$http',
	function($q, $http) {

		var searchES = function(name, isPageLoad) {
			var d = $q.defer();
			$http.post("/api/search", {
					name: name || '',
					init: isPageLoad || 0
				})
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var namesES = function() {
			var d = $q.defer();
			$http({
					method: "get",
					url: "/api/names",
					responseType: "json",
					timeout: "5000",
					cache: true,
					params: {}
				})
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var deleteES = function(name) {
			var d = $q.defer();
			$http.post("/api/delete", {
					name: name
				})
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var submitES = function(info) {
			var d = $q.defer();
			$http.post("/api/save", info)
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var loadFields = function(index) {
			var d = $q.defer();
			$http({
					method: "get",
					url: "/api/fields",
					responseType: "json",
					timeout: "5000",
					cache: true,
					params: {
						index: index
					}
				})
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var loadCfg = function() {
			var d = $q.defer();
			$http({
					method: "get",
					url: "/api/config",
					responseType: "json",
					timeout: "5000",
					cache: true
				})
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		var saveCfg = function(cfg, isStart) {
			var d = $q.defer();
			var param = {
				data: angular.fromJson(cfg),
				restart: isStart
			}
			
			param = angular.toJson(param);
			
			$http.post("/api/config", param)
				.success(function(data, status) {
					d.resolve(data);
				}).error(function(data, status) {
					DefaultError(data)
				});
			return d.promise;
		}

		return {
			search: searchES,
			del: deleteES,
			submit: submitES,
			fields: loadFields,
			names: namesES,
			cfg: loadCfg,
			cfgSave: saveCfg
		};
	}
]);