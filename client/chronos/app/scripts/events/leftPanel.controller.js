/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:LeftPanelController
 * @description
 * Controller of the chronosApp
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('LeftPanelController', LeftPanelController);

  LeftPanelController.$inject = ['EventFactory', 'StateService', '$modal'];

  function LeftPanelController(EventFactory, StateService, $modal) {
    var vm = this;

    vm.title = 'LeftPanelController';
    vm.eventFactory = EventFactory;

    vm.searchEvents = searchEvents;
    vm.openCreateEventModal = openCreateEventModal;

    function searchEvents() {
      var filterParams = {};

      if (StateService.getPlaceID()) {
        filterParams.placeID = StateService.getPlaceID();
      }

      EventFactory.getFilteredEvents(filterParams);
    }

    function openCreateEventModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/events/eventModal.html',
        controller: 'EventModalController as eventModal',
        size: 'lg',
        resolve: {
          shouldShowEventCreateModal: function () {
            return true;
          }
        }
      });
    }
  }
})();
