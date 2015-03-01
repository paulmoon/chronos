'use strict';

/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:EventPageController
 * @description
 * # EventPageController
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('EventPageController', EventPageController);

  EventPageController.$inject = ['AuthService', 'StateService', 'RestService','$modal'];

  function EventPageController(AuthService, StateService, RestService, $modal) {
    var vm = this;
  }
