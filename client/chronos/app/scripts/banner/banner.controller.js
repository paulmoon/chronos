/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp:BannerController
 * @description
 * BannerController
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('BannerController', BannerController);

  BannerController.$inject = ['AuthService', 'StateService', '$modal', 'RestService', 'EventFactory'];

  function BannerController(AuthService, StateService, $modal, RestService, EventFactory) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = '';
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.logout = AuthService.logout;

    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;
    vm.saveUserLocation = saveUserLocation;
    vm.openCreateEventModal = openCreateEventModal;

    ////////////////////////////

    function openSignupModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/auth/authModal.html',
        controller: 'AuthModalController as authModal',
        resolve: {
          shouldShowSignUpModal: function () {
            return true;
          }
        }
      });
    }

    function openLoginModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/auth/authModal.html',
        controller: 'AuthModalController as authModal',
        resolve: {
          shouldShowSignUpModal: function () {
            return false;
          }
        }
      });

      modalInstance.result
        .then(function (loginValue) {
          if(loginValue == "login"){
            RestService.getCurrentUserInformation().
              success(function(data, status, headers, config) {
                // MORE CODE NEEDS TO BE ADDED HERE WHEN BUG IS FIXED
                //StateService.setPlaceID(data.place_id);
                EventFactory.updateEvents({});
              }).
              error(function(data, status, headers, config) {
                // TODO: add something here
              });
          }
        });
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

      modalInstance.result
        .then(function (createValue) {
          if(createValue == "success"){
            EventFactory.updateEvents({});
          }
        });
    }

    function changeLocation(chosenPlaceDetails) {
      StateService.setPlaceID(chosenPlaceDetails.place_id);
      EventFactory.updateEvents({});

      if (vm.isLoggedIn()) {
        vm.saveUserLocation();
      }
    }

    function saveUserLocation() {
      var _chosenPlaceID = StateService.getPlaceID();

      RestService.updateUserLocation(_chosenPlaceID).
        success(function (data, status, headers, config) {
          // Fill in at later date
        }).
        error(function (data, status, headers, config) {
          // Fill in at later date
        });
    }
  }
})();
