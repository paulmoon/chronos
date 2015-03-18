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

  EventModalController.$inject = ['$modalInstance', 'RestService', 'shouldShowEventCreateModal', '$log'];

  function EventModalController($modalInstance, RestService, shouldShowEventCreateModal, $log) {
    var vm = this;

    vm.title = 'EventModalController';
    vm.eventName = '';
    vm.description = '';
    vm.locationId = null;
    vm.locationName = '';
    vm.startDate = '';
    vm.endDate = '';
    vm.tags = [];
    vm.files = undefined;
    vm.imageId = null;
    vm.imageUrl = undefined;
    vm.imageProgress = 0;
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;
    vm.locationPicked = locationPicked;
    vm.uploadImage = uploadImage;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    ////////////////

    /**
     * @description Calls {@link chronosApp:RestService#createEvent}|RestService.createEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function createEvent() {
      vm.shouldShowEventCreateModal = true;  
      RestService.createEvent(vm.eventName, vm.description, vm.imageId, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.locationId, vm.locationName, vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          $log.debug("RestService.createEvent failed");
        });
    }

    /**
     * @description Calls {@link chronosApp:RestService#updateEvent}|RestService.updateEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function updateEvent() {
      vm.shouldShowEventCreateModal = false;

      RestService.updateEvent(vm.eventName, vm.description, vm.picture, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          $log.debug("RestService.updateEvent failed");
        });
    };

    /**
     * @description Closes the modal window.
     * @methodOf chronosApp:EventModalController
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    };

    /**
     * @description Callback function when a location is chosen
     * @methodOf chronosApp:EventModalController
     * @parameters Details from a google autocomplete call
     */
    function locationPicked(details) {
      vm.locationId = details.place_id;
    };

    function uploadImage(files) {
      if (files && files.length) {
        vm.imageProgress = 0;
        RestService.uploadImage(files[0])
        .progress(function(evt) {
          vm.imageProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data, status, headers, config) {
          vm.imageId = data['id'];
          vm.imageUrl = data['image'];
        }).error(function() {
          $log.debug("Error uploading file");
        });
      }
    }

  }
})();
