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

  BannerController.$inject = ['AuthService', 'StateService', '$modal', 'RestService', 'EventFactory', 'PubSubService', 'settings'];

  function BannerController(AuthService, StateService, $modal, RestService, EventFactory, PubSubService, settings) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = '';
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.logout = AuthService.logout;
    vm.refreshEvents = EventFactory.refreshEvents;

    vm.onLogin = onLogin;
    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;
    vm.saveUserLocation = saveUserLocation;
    vm.openCreateEventModal = openCreateEventModal;

    _activate();

    ////////////////////////////

    function _activate() {
      if (AuthService.isLoggedIn()) {
        vm.chosenPlace = StateService.getPlaceName();
      }

      PubSubService.subscribe(settings.pubSubOnLogin, onLogin);
    }

    function onLogin() {
      if (StateService.getPlaceName() !== null) {
        vm.chosenPlace = StateService.getPlaceName();
      }
      vm.refreshEvents();
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

      modalInstance.result.then(vm.refreshEvents);
    }

    /**
     * @description Function called when a user selects a place via the Google autocomplete box.
     * @methodOf chronosApp:BannerController
     * @param chosenPlaceDetails Google Place object
     */
    function changeLocation(chosenPlaceDetails) {
      if (chosenPlaceDetails.name === '') {
        StateService.setPlaceID(null);
        StateService.setPlaceName(null);
      } else {
        StateService.setPlaceID(chosenPlaceDetails.place_id);
        StateService.setPlaceName(chosenPlaceDetails.formatted_address);
      }

      vm.refreshEvents();

      if (vm.isLoggedIn()) {
        vm.saveUserLocation();
      }
    }

    function saveUserLocation() {
      var _chosenPlaceID = StateService.getPlaceID();
      var _chosenPlaceName = StateService.getPlaceName();

      RestService.updateUserLocation(_chosenPlaceID, _chosenPlaceName).
        success(function (data, status, headers, config) {
          // Fill in at later date
        }).
        error(function (data, status, headers, config) {
          // Fill in at later date
        });
    }
  }
})();
