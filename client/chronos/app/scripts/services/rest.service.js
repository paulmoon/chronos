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

  RestService.$inject = ['$http', 'settings', '$upload', 'PubSubService'];

  function RestService($http, settings, $upload, PubSubService) {
    /**
     * @description API call for verifying credentials.
     * @methodOf chronosApp:RestService
     * @param {string} username
     * @param {string} password
     * @returns {HttpPromise}
     */
    this.login = function (username, password) {
      return $http.post(settings.serverUrl + '/users/verify_credentials/', {
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
      return $http.post(settings.serverUrl + '/users/create/', {
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
     * @param {string} placeID location ID
     * @returns {HttpPromise}
     */
    this.updateUserLocation = function (placeID, placeName) {
      return $http.put(settings.serverUrl + '/users/update/', {
        place_id: placeID,
        place_name: placeName
      });
    };

    /**
     * @description API call for retrieving the current users information
     * @methodOf chronosApp:RestService
     * @returns {HttpPromise}
     */
    this.getCurrentUserInformation = function () {
      return $http.get(settings.serverUrl + '/users/profile/');
    };

    /**
     * @description API call for retrieving the list of top 5 popular tags
     * @methodOf chronosApp:RestService
     * @returns {HttpPromise}
     */
    this.getPopularTags = function () {
      return $http.get(settings.serverUrl + '/tags/popular/');
    };

    /**
     * @description API call for getting a filtered list of events
     * @methodOf chronosApp:RestService
     * @param filterParams parameters for filtering the events
     * @returns {HttpPromise}
     */
    this.getFilteredEvents = function (filterParams) {
      var _url = settings.serverUrl + '/events/?';
      var _params = $.param(filterParams);
      return $http.get(_url + _params);
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
    this.createEvent = function (eventName, description, picture, startDate, endDate, place_id, place_name, tags) {
      return $http.post(settings.serverUrl + '/events/create/', {
        name: eventName,
        description: description,
        picture: picture,
        start_date: startDate,
        end_date: endDate,
        place_id: place_id,
        place_name: place_name,
        tags: tags
      });
    };

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
      return $http.put(settings.serverUrl + '/events/', {
        name: eventName,
        description: description,
        picture: picture,
        start_date: startDate,
        end_date: endDate,
        tags: tags
      });
    };

    /**
     * @desciption API call for voting for a specific event
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event to vote on
     * @param direction The direction to vote the event in, either 1, 0, or -1
     * @returns {HttpPromise}
     */
    this.voteEvent = function (eventId, direction) {
      return $http.post(settings.serverUrl + '/events/vote/', {
        event_id: eventId,
        direction: direction
      });
    };

    /**
     * @desciption API call for reporting a specific event
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event to report
     * @param reason The reason the event is being reported for
     * @returns {HttpPromise}
     */
    this.reportEvent = function (eventId, reason) {
      return $http.post(settings.serverUrl + '/events/report/', {
        event_id: eventId,
        reason: reason
      });
    };

    /**
     * @desciption API call for saving for a specific event to a user
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event to save
     * @returns {HttpPromise}
     */
    this.saveEvent = function(eventId) {
      return $http.put(settings.serverUrl + '/users/save/' + eventId);
    };

    /**
     * @description API call for unsaving an event for a specific user
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event to save
     * @returns {HttpPromise}
     */
    this.unsaveEvent = function(eventId) {
        return $http.put(settings.serverUrl + '/users/unsave/' + eventId);
    }

    /**
     * @description API call for getting a specific event
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event
     * @returns {HttpPromise}
     */
    this.getEvent = function (eventId) {
      return $http.get(settings.serverUrl + '/events/' + eventId);
    };

    /**
     * @description API call for uploading an image
     * @methodOf chronosApp:RestService
     * @param image An image to upload
     * @returns {HttpPromise}
     */
    this.uploadImage = function(image) {
        return $upload.upload({
            url: settings.serverUrl + '/images/',
            method: 'POST',
            file: image,
            fileFormDataName: "image",
        });
    };

    /**
     * @descrption API call for getting comments for a specific event
     * @methodOf chronosApp:RestService
     * @param eventId The id of the event
     * @returns {HttpPromise}
     */
    this.getComment = function (eventId) {
      return $http.get(settings.serverUrl + '/comments/' + eventId);
    };

    /**
     * @description API call for saving a comment for a specific event
     * @methodOf chronosApp:RestService
     * @param eventId
     * @param commentData
     * @param userId
     * @returns {HttpPromise}
     */
    this.saveComment = function (eventId, commentData, depth, path, parent) {
      return $http.post(settings.serverUrl + '/comments/create/', {
        event: eventId,
        content: commentData,
        depth: depth,
        path: path,
        parent: parent
      });
    };
  }
})();
