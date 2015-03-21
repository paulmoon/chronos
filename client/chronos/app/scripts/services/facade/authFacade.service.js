/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp:AuthFacadeService
 * @description AuthFacadeService that facilitates communication between various factories and services.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('AuthFacadeService', AuthFacadeService);

  AuthFacadeService.$inject = ['RestService', 'AuthService', 'StateService', 'EventFactory', 'PubSubService', 'settings', '$q', '$log'];

  function AuthFacadeService(RestService, AuthService, StateService, EventFactory, PubSubService, settings, $q, $log) {
    var self = this;

    this.login = function (username, password) {
      return AuthService.login(username, password)
        .then(function (response) {
          return self.retrieveUserProfile();
        }).then(function (response) {
          PubSubService.publish(settings.pubSubOnLogin);
          return response;
        }, function (response) {
          $log.warn('AuthFacadeService.login failed.');
          $log.warn(response);
          $q.reject();
        });
    };

    this.logout = function () {
      AuthService.logout();
      PubSubService.publish(settings.pubSubOnLogout);
    };

    this.createUser = function (username, firstName, lastName, password, email) {
      return AuthService.signUp(username, firstName, lastName, password, email)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnSignUp);
          return response;
        });
    };

    this.retrieveUserProfile = function () {
      return RestService.getCurrentUserInformation()
        .then(function (response) {
          if (response.data.place_id !== null) {
            StateService.setPlaceID(response.data.place_id);
          }

          if (response.data.place_name !== null) {
            StateService.setPlaceName(response.data.place_name);
          }

          if (response.data.saved_events !== null) {
            EventFactory.setSavedEvents(response.data.saved_events);
          }

          if (response.data.reported_events !== null) {
            EventFactory.setReportedEvents(response.data.reported_events);
          }

          if (response.data.voted_events !== null) {
            EventFactory.setVotedEvents(response.data.voted_events);
          }

          return response;
        }, function (response) {
          $log.warn('AuthFacadeService.retrieveUserProfile failed.');
          $log.warn(response);
          $q.reject();
        });
    };

    this.isLoggedIn = function () {
      return AuthService.isLoggedIn();
    };
  }
})();

