/**
 * @author Danny Guan
 * @ngdoc function
 * @name chronosApp:EventModalController
 * @description ViewModel for the event creation
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('EventModalController', EventModalController);

  EventModalController.$inject = ['$modalInstance', 'EventFacadeService', 'shouldShowEventCreateModal'];

  function EventModalController($modalInstance, EventFacadeService, shouldShowEventCreateModal) {
    var vm = this;

    vm.title = 'EventModalController';
    vm.eventName = '';
    vm.description = '';
    vm.locationId = null;
    vm.locationName = '';
    vm.startDate = '';
    vm.endDate = '';
    vm.picture = null;
    vm.tags = [];
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;
    vm.locationPicked = locationPicked;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    ////////////////

    /**
     * @description Calls {@link chronosApp:EventFacadeService#createEvent}|EventFacadeService.createEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function createEvent() {
      vm.shouldShowEventCreateModal = true;
      EventFacadeService.createEvent(vm.eventName, vm.description, vm.picture, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.locationId, vm.locationName, vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          console.log("EventFacadeService.createEvent failed");
        });
    }

    /**
     * @description Calls {@link chronosApp:EventFacadeService#updateEvent}|EventFacadeService.updateEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function updateEvent() {
      vm.shouldShowEventCreateModal = false;

      EventFacadeService.updateEvent(vm.eventName, vm.description, vm.picture, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          console.log("EventFacadeService.updateEvent failed");
        });
    }

    /**
     * @description Closes the modal window.
     * @methodOf chronosApp:EventModalController
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    /**
     * @description Callback function when a location is chosen
     * @methodOf chronosApp:EventModalController
     * @parameters Details from a google autocomplete call
     */
    function locationPicked(details) {
      vm.locationId = details.place_id;
    }
  }
})();
