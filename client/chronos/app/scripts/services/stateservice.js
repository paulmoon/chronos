'use strict';

/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp.stateService
 * @description
 * # stateService
 * Service in the chronosApp.
 */
angular.module('chronosApp')
  .service('StateService', function StateService() {
    this.hello = function() {
    	return "Hello";
    }

    this.goodbye = function() {
    	return "Goodbye";
    }
  });
