/**
 * @author Paul Moon
 * @name chronosApp.RouteProviderConfigs
 * @description Configuration for $routeProvider
 */

(function () {
  'use strict';

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
        templateUrl: 'scripts/events/eventModal.html',
        controller: 'EventPageController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();