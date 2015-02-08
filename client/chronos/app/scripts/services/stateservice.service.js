'use strict';

/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp.stateService
 * @description
 * # stateService
 * Service in the chronosApp.
 */

angular
  .module('chronosApp')
  .service('StateService', StateService);

//StateService.$inject = [''];

/* @ngInject */
function StateService() {
	var place_id_holder;

	this.hello = function () {
	return "Hello";
	};

	this.goodbye = function () {
	return "Goodbye";
	};

	  this.setPlaceID = function(place_id) {
		place_id_holder = place_id;
	};

	this.getPlaceID = function() {
		return place_id_holder;
	};
}
