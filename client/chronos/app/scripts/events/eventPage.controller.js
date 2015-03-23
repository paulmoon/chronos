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

  EventPageController.$inject = ['AuthFacadeService', 'EventFacadeService', '$routeParams'];

  function EventPageController(AuthFacadeService, EventFacadeService, $routeParams) {
    var vm = this;

    vm.title = 'EventPageController';
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;

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
      EventFacadeService.getEvent($routeParams.eventId)
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
          vm.startDate = moment(response.data.start_date).format('lll');
          vm.endDate = moment(response.data.end_date).format('lll');
          vm.tags = response.data.tags;
        });
    }
  }
})();
