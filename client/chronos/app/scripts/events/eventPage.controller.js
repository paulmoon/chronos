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

  EventPageController.$inject = ['AuthService', 'EventPageFactory', '$routeParams'];

  function EventPageController(AuthService, EventPageFactory, $routeParams) {
    var vm = this;

    vm.title = 'EventPageController';
    vm.isLoggedIn = AuthService.isLoggedIn;

    vm.saveEvent = 'SAVE';
    vm.saveEventClick = saveEventClick;

    _activate();

    /////////

    /**
     * @description Modifies the saved event button
     * @methodOf chronosApp:EventPageController
     */
    function saveEventClick() {
      vm.saveEvent = 'SAVED';
    }

    /**
     * @description on load page it fills in the data
     * @methodOF chronosApp:EventPageController
     * @private
     */
    function _activate() {
      EventPageFactory.updateEvent($routeParams.eventId)
        .then(function(data) {
          vm.placeName = data.place_name;
          vm.description = data.description;
          vm.name = data.name;
          vm.username = data.creator.username;
          vm.upvote = data.upvote;
          vm.downvote = data.downvote;
          vm.vote = data.vote;
          vm.picture = data.picture;
          vm.startDate = moment(data.start_date).format('MMMM Do YYYY, h:mm:ss a');
          vm.endDate =  moment(data.end_date).format('MMMM Do YYYY, h:mm:ss a');
          vm.tags = data.tags;
        });
    }

  }
