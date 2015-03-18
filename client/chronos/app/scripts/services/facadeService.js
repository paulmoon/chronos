/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp:UserProfileService
 * @description Authentication service that maintains auth states such
 *  as login/logout status, and provides methods like login/logout and
 *  sign up.
 * @requires chronosApp:RestService
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('UserProfileService', UserProfileService);

  UserProfileService.$inject = ['RestService', 'AuthService', 'StateService', 'EventFactory'];

  function UserProfileService(RestService, AuthService, StateService, EventFactory) {
    var self = this;

    

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
    this.retriveUserProfile = function () {
      var deferred = $q.defer();

      RestService.getCurrentUserInformation()
        .success(function (data, status, headers, config) {
          if (data.place_id !== null) {
            StateService.setPlaceID(data.place_id);
          }

          if (data.place_name !== null) {
            StateService.setPlaceName(data.place_name);
          }

          if (data.saved_events !== null) {
            console.log('Saving saved_events');
            console.log(data.saved_events);
            EventFactory.setSavedEvents(data.saved_events);
          }

          if (data.voted_events !== null) {
            console.log('Saving voted_events');
            console.log(data.voted_events);
            EventFactory.setVotedEvents(data.voted_events);
          }

          deferred.resolve();
        })
        .error(function (data, status, headers, config) {
          $log.warn('Failed to retrieve user information.');
          deferred.resolve();
        });
      return deferred.promise;
    };
  }
})();

