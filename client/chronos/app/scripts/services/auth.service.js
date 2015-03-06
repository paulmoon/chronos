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

  AuthService.$inject = ['$http', '$q', '$cookies', '$log', 'RestService'];

  function AuthService($http, $q, $cookies, $log, RestService) {
    var self = this;
    self.username = '';

    activate();

    //////////////////

    function activate() {
      var token = $cookies.authTokenCookie;
      if (token && token.length > 0) {
        $http.defaults.headers.common.Authorization = "Token " + token;
      }
    }

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
          self.setCredentials(username);
          self.setHeaderToken(response.data.token);
          self.setSessionCookie(response.data.token);
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
      self.setCredentials('');
      self.setHeaderToken('');
      self.setSessionCookie('');
    };

    /**
     * @description Create a new user account. firstName, lastName, and email are required.
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
      return $cookies.authTokenCookie && $cookies.authTokenCookie !== '';
    };

    /**
     * @methodOf chronosApp:AuthService
     * @param {string} username
     */
    this.setCredentials = function (username) {
      self.username = username;
    };

    /**
     * Set the auth token to every outgoing HTTP header, formatted as "Token <token>".
     * @methodOf chronosApp:AuthService
     * @param token
     */
    this.setHeaderToken = function (token) {
      if (token !== 'undefined') {
        $http.defaults.headers.common.Authorization = "Token " + token;
      } else {
        $log.debug('Attempted to set header token with an undefined token');
      }
    };

    /**
     * Saves the user authentication token to a cookie to persist user login state.
     * @methodOf chronosApp:AuthService
     * @param authToken Authentication token obtained after logging in
     */
    this.setSessionCookie = function (authToken) {
      // FIXME: Angular 1.4 allows setting expiration date on cookies. https://docs.angularjs.org/api/ngCookies/provider/$cookiesProvider#defaults
      // Create cookiesProvider.config.js, and set expiry times.
      $cookies.authTokenCookie = authToken;
    };

    /**
     * Returns the authentication token stored in a cookie.
     * @methodOf chronosApp:AuthService
     * @returns {*} Authentication token
     */
    this.getSessionCookie = function () {
      return $cookies.authTokenCookie;
    };
  }
})();
