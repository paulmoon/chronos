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

  EventModalController.$inject = ['$scope', '$modalInstance', 'RestService', 'shouldShowEventCreateModal'];

  function EventModalController($scope, $modalInstance, RestService, shouldShowEventCreateModal) {
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
    vm.files = undefined;
    vm.shouldShowEventCreateModal = shouldShowEventCreateModal;
    vm.locationPicked = locationPicked;
    vm.uploadFile = uploadFile;

    vm.createEvent = createEvent;
    vm.cancel = cancel;

    $scope.$watch('files', function() {
      vm.uploadFile($scope.files);
    });

    ////////////////

    /**
     * @description Calls {@link chronosApp:RestService#createEvent}|RestService.createEvent} to create event.
     * @methodOf chronosApp:EventModalController
     */
    function createEvent() {
      vm.shouldShowEventCreateModal = true;  
      RestService.createEvent(vm.eventName, vm.description, vm.picture, moment(vm.startDate).utc().format(), moment(vm.endDate).utc().format(), vm.locationId, vm.locationName, vm.tags)
        .then(function (data) {
          $modalInstance.close();
        }, function () {
          console.log("RestService.createEvent failed");
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
          console.log("RestService.updateEvent failed");
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

    function uploadFile(files) {
      console.log(files);
      if (files && files.length) {
        RestService.uploadImage(files[0])
        .progress(function(evt) {
          console.log('progress' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('file ' + config.file.name);
        }).error(function() {
          console.log("Error uploading file");
        });
      }
    }

  }
})();
