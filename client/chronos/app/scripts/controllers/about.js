'use strict';

/**
 * @ngdoc function
 * @name chronosApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
