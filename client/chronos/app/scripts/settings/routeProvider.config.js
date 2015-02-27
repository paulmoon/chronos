(function () {
  angular
    .module('chronosApp')
    .config(RouteProviderConfigs);

  RouteProviderConfigs.$inject = ['$routeProvider'];

  function RouteProviderConfigs($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/chronos/main.html'
        // controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'scripts/chronos/about.html'
        // controller: 'AboutCtrl'
      })
      .when('/event/:eventId', {
        templateUrl: 'scripts/chronos/eventModal.html',
        controller: 'EventPageController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
