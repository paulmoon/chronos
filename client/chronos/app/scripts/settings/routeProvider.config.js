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
        templateUrl: 'scripts/chronos/main.html',

        resolve: {
          /* @ngInject */
          userDetails: function (AuthFacadeService) {
            if (AuthFacadeService.isLoggedIn()) {
              return AuthFacadeService.retrieveUserProfile();
            }
          }
        }
      })
      .when('/about', {
        templateUrl: 'scripts/chronos/about.html'
      })
      .when('/event/:eventId', {
        templateUrl: 'scripts/events/eventPage.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
