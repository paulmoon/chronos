(function () {
  /**
   * @ngdoc overview
   * @name chronosApp
   * @description
   * # chronosApp
   *
   * Main module of the application.
   */

  'use strict';

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
      'ui.calendar',
      'ngTagsInput',
      'ngClipboard',
      'leaflet-directive'
    ]);
})();
