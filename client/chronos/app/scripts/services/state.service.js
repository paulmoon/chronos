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
	var _placeIDHolder;

	this.hello = function () {
	return "Hello";
	};

	this.goodbye = function () {
	return "Goodbye";
	};

	this.setPlaceID = function(_placeID) {
		_placeIDHolder = _placeID;
	};

	this.getPlaceID = function() {
		return _placeIDHolder;
	};
}
