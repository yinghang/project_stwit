angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// check if user is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every new front-end request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();	
	});	

	// function to handle login through StockTwits
	vm.doLogin = function() {
		// redirect to StockTwits
		var st_uri = 'https://api.stocktwits.com/api/2/oauth/authorize?client_id=fddddc8ee08e5b63&response_type=code&redirect_uri=http://yinghang.ngrok.io/auth&scope=read,watch_lists,publish_messages,publish_watch_lists,direct_messages,follow_users,follow_stocks'
		window.location.replace(st_uri);
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		
		window.location.replace('/');
	};

	// get sentiment
	vm.getSentiment = function() {
		vm.processing = true;
		vm.error = '';
		Auth.find(vm.ticker)
		.then(function(data){
			vm.processing = false;
			if (data.data.error) {
				vm.error = "Ticker not found! Try again.";
				
			} else {
				vm.symbol = vm.ticker;
				vm.polarity = data.data.polarity;
			}
		});
	}
});