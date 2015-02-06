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
    var isLoggedIn = false;
    var username = '';
    var password = '';

    this.login = function (username, password) {
      return $http.post(setting.baseUrl + '/user/verify_credentials', {
        username: username,
        password: password
      }).then(function (response) {
        isLoggedIn = true;
        return response.data;
      }, function (response) {
        return $q.reject(response.data);
      });
    };

    this.signUp = function (username, firstName, lastName, password, email) {
      return $http.post(setting.baseUrl + '/user/create', {
        username: username,
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email
      }).then(function (response) {
        console.log(response);
        return response;
      }, function (response) {
        console.log('Error while creating a new account' + username + ' ' + password);
        return response;
      });
    };

    this.setCredentials = function(username, password) {
      this.username = username;
      this.password = password;
    };
  }

})();
