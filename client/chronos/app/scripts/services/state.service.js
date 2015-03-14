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

  StateService.$inject = ['$log', '$q', 'RestService', 'GoogleMapsFactory'];

  function StateService($log, $q, RestService, GoogleMapsFactory) {
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

    this.retrieveState = function () {
      return RestService.getCurrentUserInformation()
        .success(function (data, status, headers, config) {
          if (data.place_id === undefined) {
            return;
          }

          var request = {
            placeId: data.place_id
          };

          var service = new google.maps.places.PlacesService(GoogleMapsFactory.getDivElement());

          service.getDetails(request, function (place, status) {
            console.log('place');
            console.log(place);
            console.log('status');
            console.log(status);

            if (status === 'OK') {
              console.log(place.place_id);
              console.log(place.formatted_address);
              StateService.setPlaceID(place.place_id);
              //_updateLocationDetails(place.place_id);
              //vm.chosenPlace = place.formatted_address;
            }
          });
        })
        .error(function (data, status, headers, config) {
          console.log("Couldn't get user information.");
          $log.warn('Could not get any user information');
          $q.reject();
        });
    };
  }
})();

