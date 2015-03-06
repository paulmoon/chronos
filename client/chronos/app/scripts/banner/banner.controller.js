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

  BannerController.$inject = ['$scope', 'AuthService', 'StateService', '$modal', 'RestService'];

  function BannerController($scope, AuthService, StateService, $modal, RestService) {
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

    activate();

    ////////////////////////////

    function activate() {
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
      modalInstance.result
        .then(vm.onLogin);
    }

    /**
     * @description Function called when the user just logs into the system. Currently,
     * it only gets the user's place id, correlates it to a place, and puts that string in the autocomplete
     * box.
     * @methodOf chronosApp:BannerController
     */
    function onLogin() {
      RestService.getCurrentUserInformation()
        .success(function (data, status, headers, config) {
          if (data.place_id === null) {
            return;
          }

          var request = {
            placeId: data.place_id
          };

          var service = new google.maps.places.PlacesService($scope._element);

          service.getDetails(request, function (place, status) {
            if (status === 'OK') {
              StateService.setPlaceID(place.place_id);
              vm.chosenPlace = place.formatted_address;
            }
          });
        })
        .error(function (data, status, headers, config) {
          console.log("Couldn't get user information. Not doing any onLogin work");
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
    }

    function changeLocation(chosenPlaceDetails) {
      StateService.setPlaceID(chosenPlaceDetails.place_id);

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
