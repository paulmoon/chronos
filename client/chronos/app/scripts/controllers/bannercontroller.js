'use strict';

/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:BannerController
 * @description
 * # BannerController
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('BannerController', function ($scope, StateService) {
    	$scope.doHello = function() {
    		$scope.value = StateService.hello(); 
    	}

    	$scope.doGoodbye = function() {
    		$scope.value = StateService.goodbye();
    	}
  });
