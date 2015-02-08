'use strict';

/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp.RestService
 * @description
 * # RestService
 * Service in the chronosApp.
 */
angular.module('chronosApp')
  .service('RestService', function RestService($http, StateService) {

  	this.getFilteredEvents = function() {

  		var url = StateService.getServerAddress() + 'events/?';
        var placeID = StateService.getPlaceID();

        if(placeID){
            // Can leave the & at beginning even if its the first param
            url = url + '&placeID=' + placeID
        }

  		return $http.get(url)
    }
  });
 