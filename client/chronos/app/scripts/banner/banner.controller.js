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

  BannerController.$inject = ['$scope', 'AuthService', 'StateService', '$modal', 'RestService', 'EventFactory'];

  function BannerController($scope, AuthService, StateService, $modal, RestService, EventFactory) {
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
    vm.onLogin = onLogin;

    _activate();

    ////////////////////////////

    function _activate() {
      if (AuthService.isLoggedIn()) {
        onLogin();
      }
    }

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

      modalInstance.result.then(vm.onLogin);
    }

    /**
     * @description Function called when the user just logs into the system. Currently,
     * it only gets the user's place id, correlates it to a place, and puts that string in the autocomplete
     * box.
     * @methodOf chronosApp:BannerController
     */

    function onLogin() {
      // Need to ensure that the place ID is set.
      EventFactory.refreshEvents();
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

      modalInstance.result.then(vm.onLogin);
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
        .then(function () {
          EventFactory.refreshEvents();
        });
    }

    function changeLocation(chosenPlaceDetails) {
      StateService.setPlaceID(chosenPlaceDetails.place_id);
      EventFactory.refreshEvents();

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
