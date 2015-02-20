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
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.timepicker',
    'ngTagsInput'
  ])
  .config(function ($routeProvider, tagsInputConfigProvider) {
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
    tagsInputConfigProvider.setDefaults('tagsInput', {
      placeholder: 'New tag',
      removeTagSymbol: '✖'
    });
  })
  .constant('setting', {
    serverUrl: 'http://localhost:8000'
  });
