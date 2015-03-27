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

  EventModalController.$inject = ['$modalInstance', 'EventFacadeService', 'shouldShowEventCreateModal', '$log', 'NotificationService', 'settings'];

  function EventModalController($modalInstance, EventFacadeService, shouldShowEventCreateModal, $log, NotificationService, settings) {
    var vm = this;

    vm.title = 'EventModalController';
    vm.eventName = '';
    vm.description = '';
    vm.locationId = null;
    vm.locationName = '';
    vm.startDate = '';
    vm.endDate = '';
    vm.tags = [];
    vm.popularTags = [];
    vm.imageId = null;
    vm.imageUrl = undefined;
    vm.loading = false;
    vm.imageProgress = 0;
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;
    vm.locationPicked = locationPicked;
    vm.uploadImage = uploadImage;
    vm.removeImage = removeImage;
    vm.addPopularTag = addPopularTag;
    vm.verifyTags = verifyTags;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    vm.loadingBlurStyle = {
      opacity: 1
    };

    _activate();

    ////////////////

    function _activate(){
      EventFacadeService.getPopularTags().
        success(function (data, status, headers, config) {
          vm.popularTags = data;
        }).
        error(function (data, status, headers, config) {
          // Do something
        });
    }

    /**
     * @description Called by crete function to check the inputs
     * @methodOf chronosApp:EventModalController
     */
    function _sanatizeInputs(){
      vm.creationError = '';
      
      if (!vm.eventName){
        vm.creationError = 'Event name required.';
      } else if (!vm.description){
        vm.creationError = 'Description required.';
      } else if (!vm.locationName){
        vm.creationError = 'Location required.';
      } else if (!vm.startDate){
        vm.creationError = 'Start date required.';
      } else if (!vm.endDate){
        vm.creationError = 'End date required.';
      } else if (!vm.locationId){
        vm.creationError = 'Invalid location.';
      } else if (vm.eventName.length > 100){
        vm.creationError = 'Name is longer than 100 characters.';
      } else if (vm.startDate.getTime() > vm.endDate.getTime()){
        vm.creationError = 'End date starts before start date.';
      }

      if (vm.creationError){
        NotificationService.errorMessage(vm.creationError);
        return false;
      }

      return true;   
    }

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

      if (_sanatizeInputs() == false){
        vm.loading = false;
        vm.loadingBlurStyle = {
          opacity: 1
        };
        return;
      }

      EventFacadeService.createEvent(vm.eventName, vm.description, vm.imageId, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.locationId, vm.locationName, vm.tags)
        .then(function (data) {
          NotificationService.noticeMessage("Event Created.");
          $modalInstance.close();
          vm.loading = false;
          vm.loadingBlurStyle = {
            opacity: 1
          };
        }, function () {
          $log.debug("EventFacadeService.createEvent failed");
          vm.loading = false;
          vm.loadingBlurStyle = {
            opacity: 1
          };
        });
    }

    /**
     * @description Calls {@link chronosApp:EventFacadeService#updateEvent}|EventFacadeService.updateEvent} to update event.
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

    /**
     * @description Handles when a file is selected to be uploaded
     * @methodOf chronosApp:EventModalController
     * @parameters the file being uploaded
     */
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

    /**
     * @description Removes the information on the uploaded file so a different one can be added
     * @methodOf chronosApp:EventModalController
     */
    function removeImage() {
      vm.imageProgress = 0;
      vm.imageId = null;
      vm.imageUrl = undefined;
    }

    /**
     * @description Checks if more than the max number of tags are being used
     * @methodOf chronosApp:EventModalController
     */
    function verifyTags(){
      if (vm.tags.length > settings.maxNumberTags) {
        vm.tags.splice(-1, 1);
        vm.creationError = "Max of 5 tags.";
        NotificationService.errorMessage(vm.creationError);
      }
    }

    /**
     * @description Checks if a duplicate tag exists
     * @methodOf chronosApp:EventModalController
     * @parameters the tag chosen
     */
    function addPopularTag(tag) {
      vm.creationError = '';
      var noMatch = true;
      var tempTags = [];


      delete tag['usage'];
      delete tag['$$hashKey'];

      vm.tags.forEach(function (tag2) {
        if (tag2.name == tag.name){
          noMatch = false;
        }
      });

      if (noMatch) {
        vm.tags.push(tag);
      } else {
        vm.creationError = "Identical Tag Found.";
        NotificationService.errorMessage(vm.creationError);
      }

      verifyTags();
    }
  }
})();
