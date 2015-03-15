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

  StateService.$inject = ['$log', '$q', 'RestService'];

  function StateService($log, $q, RestService) {
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

    /**
     * @description Gets user information from the server and uses Google Places API and user's place ID to look up
     * the formatted address. Sets place_id and placeName for StateService.
     *
     * Note that we need to use $q.defer() because $routeProvider is waiting for the promises
     * to be resolved/rejected, and thinks the promise is resolved as soon as we enter
     * RestService.getCurrentUserInformation.success(). By deferring the promise, we make $routeProvider wait until
     * after processing the user profile information.
     *
     * All the promises are resolved because if any of the promises are rejected, $routeProvider will not initialize
     * the controllers.
     * @methodOf chronosApp.stateService
     * @returns {*} Promise object which will always be resolved
     */
    this.retrieveUserPlace = function () {
      var deferred = $q.defer();
      RestService.getCurrentUserInformation()
        .success(function (data, status, headers, config) {
          if (data.place_id === null) {
            deferred.resolve();
            return;
          }

          // jQuery element
          var element = angular.element('<div class="empty"></div>');
          var service = new google.maps.places.PlacesService(element[0]);
          var request = {
            placeId: data.place_id
          };

          service.getDetails(request, function (place, status) {
            if (status === 'OK') {
              self.setPlaceID(place.place_id);
              self.setPlaceName(place.formatted_address);
            } else {
              $log.warn('Failed to retrieve user information.');
            }
            deferred.resolve();
          });
        })
        .error(function (data, status, headers, config) {
          $log.warn('Failed to retrieve user information.');
          deferred.resolve();
        });
      return deferred.promise;
    };
  }
})();

