'use strict';

/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:LeftPanelController
 * @description
 * # LeftPanelController
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('LeftPanelController', function ($scope, RestService) {
      $scope.RestService = RestService;
      $scope.events = [];         

      $scope.searchEvents = function() {
         RestService.getFilteredEvents().
            success(function(data, status, headers, config) {
               $scope.events = data;
               console.log("Retreived events succesfully.");                
            }).
            error(function(data, status, headers, config) {
               console.log("Failed to retreive events.");
            });
      }
  });
