angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html',
			controller  : 'mainController',
			controllerAs: 'login'
		})

		// route for oauth callback
		.when('/auth', {
			templateUrl: 'app/views/pages/home.html',
			controller: function ($location, $rootScope, $http, AuthToken){
				console.log($location.search()['code'])
				$http.post('/api/authenticate', {
					token: $location.search()['code']
				})
				.success(function(data) {
					AuthToken.setToken($location.search()['code']);
					$location.path('/');
				});
			}
		})

	$locationProvider.html5Mode(true);

});