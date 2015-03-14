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
  //RouteProviderConfigs.$inject = ['$routeProvider', 'AuthService', 'StateService'];

  function RouteProviderConfigs($routeProvider) {
  //function RouteProviderConfigs($routeProvider, AuthService, StateService) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/chronos/main.html',

        resolve: {
          'userDetails': function (AuthService, StateService) {
            if (AuthService.isLoggedIn()) {
              StateService.retrieveState();
            }
          }
        }
      })
      .when('/about', {
        templateUrl: 'scripts/chronos/about.html'
      })
      .when('/event/:eventId', {
        templateUrl: 'scripts/events/eventPage.html',
        controller: 'EventPageController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
