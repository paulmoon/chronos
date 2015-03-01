/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp.stateService
 * @description Holds application state information such as place ID.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('StateService', StateService);

  function StateService() {
    var _placeIDSearch;

    /**
     * Place ID Search set/get
     */
    this.setPlaceID = function (placeID) {
      _placeIDSearch = placeID;
    };

    this.getPlaceID = function () {
      return _placeIDSearch;
    };
  }
})();

