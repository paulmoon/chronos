'use strict';

/**
 * @ngdoc overview
 * @name chronosApp
 * @description
 * # chronosApp
 *
 * Main module of the application.
 */
angular
  .module('chronosApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        // controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        // controller: 'AboutCtrl'
      })
      .when('/event/:eventId', {
        templateUrl: 'views/eventpage.html',
        controller: 'EventPageController',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
