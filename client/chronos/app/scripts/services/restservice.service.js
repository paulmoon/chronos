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
     * @description API call for updating a user location.
     * @methodOf chronosApp:RestService
     * @param {string} location ID
     * @returns {HttpPromise}
     */
    this.updateUserLocation = function (placeID) {
      return $http.put(setting.serverUrl + '/users/update/', {
        place_id: placeID
      });
    };

    /**
     * @description API call for getting a filtered list of events
     * @methodOf chronosApp:RestService
     * @returns {HttpPromise}
     */
    this.getFilteredEvents = function() {
      var _url = setting.serverUrl + '/events/?';
      var _placeID = StateService.getPlaceID();
      var _dateRangeStart = StateService.getDateRangeStart();
      var _dateRangeEnd = StateService.getDateRangeEnd();
      var _tags = StateService.getTags();

      if(_placeID){
        _url = _url + '&placeID=' + _placeID;
      }

      if(_dateRangeStart){
        if(_dateRangeEnd){
          _url = _url + '&fromDate=' + _dateRangeStart + '&toDate=' + _dateRangeEnd;
        }else{
          _url = _url + '&fromDate=' + _dateRangeStart;
        }
      }

      //if(_tags){
        // Can leave the & at beginning even if its the first param
        //_url = _url + '&placeID=' + _placeID;
      //}

      return $http.get(_url);
    };

    /**
     * @description API call for creating a event
     * @methodOf chronosApp:RestService
     * @param eventName
     * @param description
     * @param picture
     * @param startDate
     * @param endDate
     * @param tags
     * @returns {HttpPromise}
     */
    this.createEvent = function(eventName, description, picture, startDate, endDate, tags) {
      return $http.post(setting.serverUrl + '/events/', {
        name: eventName,
        description: description,
        picture: picture,
        start_date: startDate,
        end_date: endDate,
        tags: tags
      });
    }

    /**
     * @description API call for updating a event
     * @methodOf chronosApp:RestService
     * @param eventName
     * @param description
     * @param picture
     * @param startDate
     * @param endDate
     * @param tags
     * @returns {HttpPromise}
     */
    this.updateEvent = function (eventName, description, picture, startDate, endDate, tags) {
      return $http.put(setting.serverUrl + '/events/', {
        name: eventName,
        description: description,
        picture: picture,
        start_date: startDate,
        end_date: endDate,
        tags: tags
      });
    }
  }
})();
