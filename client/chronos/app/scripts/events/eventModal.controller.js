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

  EventModalController.$inject = ['$modalInstance', 'EventFacadeService', 'shouldShowEventCreateModal', '$log'];

  function EventModalController($modalInstance, EventFacadeService, shouldShowEventCreateModal, $log) {
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
    vm.loading = false;
    vm.imageProgress = 0;
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;
    vm.locationPicked = locationPicked;
    vm.uploadImage = uploadImage;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    vm.loadingBlurStyle = {
      opacity: 1
    };

    ////////////////

    /**
     * @description Calls {@link chronosApp:EventFacadeService#createEvent}|EventFacadeService.createEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function createEvent() {
      vm.shouldShowEventCreateModal = true;  
      vm.loading = true;
      vm.loadingBlurStyle = {
        opacity: 0.4
      };

      setTimeout(function () {
        EventFacadeService.createEvent(vm.eventName, vm.description, vm.imageId, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.locationId, vm.locationName, vm.tags)
          .then(function (data) {
            $modalInstance.close();
          }, function () {
            $log.debug("EventFacadeService.createEvent failed");
          });
        vm.loading = false;
        vm.loadingBlurStyle = {
          opacity: 1
        };
      }, 5000);
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
          $log.debug("EventFacadeService.updateEvent failed");
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

    function uploadImage(files) {
      if (files && files.length) {
        vm.imageProgress = 0;
        EventFacadeService.uploadImage(files[0])
          .progress(function (evt) {
            vm.imageProgress = parseInt(100.0 * evt.loaded / evt.total);
          }).success(function (data, status, headers, config) {
            vm.imageId = data['id'];
            vm.imageUrl = data['image'];
          }).error(function () {
            $log.debug("Error uploading file");
          });
      }
    }

  }
})();
