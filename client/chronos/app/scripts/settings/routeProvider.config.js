(function () {
  angular
    .module('chronosApp')
    .config(RouteProviderConfigs);

  RouteProviderConfigs.$inject = ['$routeProvider'];

  function RouteProviderConfigs($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
        // controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
        // controller: 'AboutCtrl'
      })
      .when('/event/:eventId', {
        templateUrl: 'views/eventpage.html',
        controller: 'EventPageController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
