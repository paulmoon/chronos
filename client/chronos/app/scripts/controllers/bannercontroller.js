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

    	$scope.changeLocation = function(chosenPlaceDetails) {
    		// Save location to StateService. Change filters, etc
    		StateService.setPlaceID(chosenPlaceDetails.place_id);
    	}
  });
