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

  EventPageController.$inject = ['AuthService', 'RestService', 'EventPageFactory', '$location', '$scope', '$route', '$q'];

  function EventPageController(AuthService, RestService, EventPageFactory, $location, $scope, $route, $q) {
    var vm = this;
    var init = EventPageFactory.updateEvent();
    vm.title = 'EventPageController';
    init.then(function(data) {
      console.log(data);
      vm.placeName = data.place_name;
      vm.description = data.description;
      vm.name = data.name;
      vm.username = data.creator.username;
      vm.upvote = data.upvote;
      vm.downvote = data.downvote;
      vm.vote = data.vote;
    });

    vm.copyUrl = $location.absUrl();
    vm.copyButton = 'COPY';
    vm.saveEvent = 'SAVE';
    $scope.saveEvent = saveEvent;
    $scope.copyText = copyText;
    $scope.copyValue = copyValue;

    /////////

    /**
     * @description Modifies the saved event button
     * @methodOf chronosApp:EventPageController
     */
    function saveEvent() {
      vm.saveEvent = 'SAVED';
    }

    /**
     * @description Returns the full url of the page
     * @methodOf chronosApp:EventPageController
     */
    function copyText() {
      return $location.absUrl();
    }

    /**
     * @description Modifies the copy values button
     * @methodOf chronosApp:EventPageController
     */
    function copyValue() {
      vm.copyButton = 'COPIED';
    }
  }
