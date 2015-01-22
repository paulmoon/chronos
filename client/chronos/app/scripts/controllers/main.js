'use strict';

/**
 * @ngdoc function
 * @name chronosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
