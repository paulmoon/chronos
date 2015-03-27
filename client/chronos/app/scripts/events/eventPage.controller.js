(function () {
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

  EventPageController.$inject = ['AuthFacadeService', 'EventFacadeService', '$routeParams', '$location'];

  function EventPageController(AuthFacadeService, EventFacadeService, $routeParams, $location) {
    var vm = this;

    vm.title = 'EventPageController';
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;
    vm.eventId = $routeParams.eventId;

    vm.url = $location.absUrl();

    vm.getVotedEvents = EventFacadeService.getVotedEvents;

    _activate();
    /////////


    /**
     * @description on load page it fills in the data
     * @methodOF chronosApp:EventPageController
     * @private
     */
    function _activate() {
      EventFacadeService.getEvent(vm.eventId)
        .then(function (response) {
          vm.placeName = response.data.place_name;
          vm.placeId = response.data.placeId;
          vm.description = response.data.description;
          vm.name = response.data.name;
          vm.username = response.data.creator.username;
          vm.upvote = response.data.upvote;
          vm.downvote = response.data.downvote;
          vm.vote = response.data.vote;
          vm.picture = response.data.picture;
          vm.startDate = moment.utc(response.data.start_date).local().format('lll');
          vm.endDate = moment.utc(response.data.end_date).local().format('lll');
          vm.tags = response.data.tags;
        });

      EventFacadeService.retrieveComment(vm.eventId);
    }

  }
})();
