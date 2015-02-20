/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp:AuthService
 * @description Authentication service that maintains auth states such
 *  as login/logout status, and provides methods like login/logout and
 *  sign up.
 * @requires chronosApp:RestService
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('AuthService', AuthService);

  AuthService.$inject = ['$http', '$q', 'RestService', 'StateService'];

  function AuthService($http, $q, RestService, StateService) {
    var self = this;
    self._isLoggedIn = false;
    self.username = '';
    self.auth_token = '';

    /**
     * @description Login with provided username and password. Sets the auth token
     *  to $http header.
     * @methodOf chronosApp:AuthService
     * @param {string} username
     * @param {string} password
     * @returns {*} The response object if login was successful, and a rejected
     *  promise if not.
     */
    this.login = function (username, password) {
      return RestService.login(username, password)
        .then(function (response) {
          self._isLoggedIn = true;
          self.setCredentials(username, response.data);
          self.setHeaderToken(response.data);
          return response;
        }, function (response) {
          return $q.reject(response);
        });
    };

    /**
     * @description Logout. Sets the $http header auth token to null.
     * @methodOf chronosApp:AuthService
     */
    this.logout = function () {
      self._isLoggedIn = false;
      self.setCredentials('', '');
      self.setHeaderToken(null);
    };

    /**
     * @description Create a new user account. All params are required.
     * @methodOf chronosApp:AuthService
     * @param {string} username
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} password
     * @param {string} email
     * @returns {*} Response object if user creation was successful, and
     *  a reject promise otherwise.
     */
    this.signUp = function (username, firstName, lastName, password, email) {
      return RestService.createUser(username, firstName, lastName, password, email)
        .then(function (response) {
          return response;
        }, function (response) {
          return $q.reject(response);
        });
    };

    /**
     * @methodOf chronosApp:AuthService
     * @returns {boolean} true if current user is logged in, false if not.
     */
    this.isLoggedIn = function () {
      return self._isLoggedIn;
    };

    /**
     * @methodOf chronosApp:AuthService
     * @param {string} username
     * @param {string} auth_token
     */
    this.setCredentials = function (username, auth_token) {
      self.username = username;
      self.auth_token = auth_token;
    };

    /**
     * @methodOf chronosApp:AuthService
     * @param token
     */
    this.setHeaderToken = function (token) {
      if (token)
      {
        token = "Token " + token.token;
      }
      $http.defaults.headers.common.Authorization = token;

    };
  }
})();
