/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.AuthService
 * @description
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('AuthService', AuthService);

  AuthService.$inject = ['$http', '$q', 'setting'];

  function AuthService($http, $q, setting) {
    var self = this;
    this._isLoggedIn = false;
    this.username = '';
    this.password = '';

    this.login = function (username, password) {
      return $http.post(setting.serverUrl + '/users/verify_credentials', {
        username: username,
        password: password
      }).then(function (response) {
        self._isLoggedIn = true;
        self.setCredentials(username, password);
        self.setHeaderToken(response.data);

        console.log(self._isLoggedIn);

        return response;
      }, function (response) {
        return $q.reject(response);
      });
    };

    this.logout = function () {
      self._isLoggedIn = false;
      self.setCredentials('', '');
      self.setHeaderToken(null);
    };

    this.signUp = function (username, firstName, lastName, password, email) {
      return $http.post(setting.serverUrl + '/users/create', {
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
        email: email
      }).then(function (response) {
        return response;
      }, function (response) {
        return $q.reject(response);
      });
    };

    this.isLoggedIn = function () {
      return self._isLoggedIn;
    }

    this.setCredentials = function (username, password) {
      self.username = username;
      self.password = password;
    };

    this.setHeaderToken = function (token) {
      $http.defaults.headers.common.Authorization = token;
      console.log($http.defaults.headers.common.Authorization);
    };
  }
})();
