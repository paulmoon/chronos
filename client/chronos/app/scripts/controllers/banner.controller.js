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

  BannerController.$inject = ['AuthService', 'StateService', '$modal', 'RestService'];

  function BannerController(AuthService, StateService, $modal, RestService) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = null;
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.logout = AuthService.logout;

    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;
    vm.saveUserLocation = saveUserLocation;

    ////////////////////////////

    function openSignupModal() {
      var modalInstance = $modal.open({
        templateUrl: 'views/authModal.html',
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
        templateUrl: 'views/authModal.html',
        controller: 'AuthModalController as authModal',
        resolve: {
          shouldShowSignUpModal: function () {
            return false;
          }
        }
      });
    }

    function changeLocation(chosenPlaceDetails) {
      StateService.setPlaceID(chosenPlaceDetails.place_id);
    }

    function saveUserLocation() {
      var _chosenPlaceID = StateService.getPlaceID();

      RestService.updateUserLocation(_chosenPlaceID).
        success(function(data, status, headers, config) {
           // Fill in at later date
        }).
        error(function(data, status, headers, config) {
           // Fill in at later date
        });
    }
  }
})();
