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

  StateService.$inject = [];

  function StateService() {
    var self = this;
    var _placeID;
    var _placeName;

    /**
     * @description Set Google Places placeID e.g. ChIJcWGw3Ytzj1QR7Ui7HnTz6Dg
     * @methodOf chronosApp.stateService
     * @param placeID
     */
    this.setPlaceID = function (placeID) {
      _placeID = placeID;
    };

    /**
     * @description Get Google Places placeID e.g. ChIJcWGw3Ytzj1QR7Ui7HnTz6Dg
     * @methodOf chronosApp.stateService
     * @returns {*} PlaceID currently set in the application
     */
    this.getPlaceID = function () {
      return _placeID;
    };

    /**
     * @description Set Google Places formatted_address e.g. "Victoria, BC, Canada"
     * @methodOf chronosApp.stateService
     * @param placeName
     */
    this.setPlaceName = function (placeName) {
      _placeName = placeName;
    };

    /**
     * @description Get Google Places place name e.g. "Victoria, BC, Canada"
     * @methodOf chronosApp.stateService
     * @returns {*} Place name currently set in the application
     */
    this.getPlaceName = function () {
      return _placeName;
    };
  }
})();

