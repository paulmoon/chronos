/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp:RestService
 * @description REST API service for accessing the URLs provided by
 *  the Django server. Congregating the URLs in RestService makes them
 *  easy to change.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('RestService', RestService);

  RestService.$inject = ['$http', 'setting', 'StateService'];

  function RestService($http, setting, StateService) {
    /**
     * @description API call for verifying credentials.
     * @methodOf chronosApp:RestService
     * @param {string} username
     * @param {string} password
     * @returns {HttpPromise}
     */
    this.login = function (username, password) {
      return $http.post(setting.serverUrl + '/users/verify_credentials/', {
        username: username,
        password: password
      });
    };

    /**
     * @description API call for creating a user account.
     * @methodOf chronosApp:RestService
     * @param {string} username
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} password
     * @param {string} email
     * @returns {HttpPromise}
     */
    this.createUser = function (username, firstName, lastName, password, email) {
      return $http.post(setting.serverUrl + '/users/create/', {
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
        email: email
      });
    };

    /**
     * @description API call for getting a filtered list of events
     * @methodOf chronosApp:RestService
     * @returns {HttpPromise}
     */
    this.getFilteredEvents = function() {
      var url = setting.serverUrl + '/events/?';
      var placeID = StateService.getPlaceID();

      // Add more filter options as appropriate
      if(placeID){
        // Can leave the & at beginning even if its the first param
        url = url + '&placeID=' + placeID
      }

      return $http.get(url);
    };
  }
})();
