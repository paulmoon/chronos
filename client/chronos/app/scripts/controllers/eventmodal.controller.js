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

  EventModalController.$inject = ['$modalInstance', 'RestService', 'shouldShowEventCreateModal'];

  function EventModalController($modalInstance, RestService, shouldShowEventCreateModal) {
    var vm = this;

    vm.title = 'EventModalController';
    vm.eventName = '';
    vm.description = '';
    vm.startDate = '';
    vm.endDate = '';
    vm.picture = null;
    vm.tags = [];
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    ////////////////

    /**
     * @description Calls {@link chronosApp:RestService#createEvent}|RestService.createEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function createEvent() {
      vm.shouldShowEventCreateModal = true;
      RestService.createEvent(vm.eventName, vm.description, vm.picture, vm.startDate, vm.endDate, vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function (response) {
          console.log(response);
          console.log("RestService.createEvent failed");
        });
    }

    /**
     * @description Calls {@link chronosApp:RestService#updateEvent}|RestService.updateEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function updateEvent() {
      vm.shouldShowEventCreateModal = false;

      RestService.updateEvent(vm.eventName, vm.description, vm.picture, vm.startDate, vm.endDate, vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          console.log("RestService.updateEvent failed");
        });
    }

    /**
     * @description Closes the modal window.
     * @methodOf chronosApp:RestModalController
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
