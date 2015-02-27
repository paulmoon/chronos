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

  BannerController.$inject = ['AuthService', 'StateService', '$modal'];

  function BannerController(AuthService, StateService, $modal) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = null;
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.logout = AuthService.logout;

    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;

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
    }

    function changeLocation(chosenPlaceDetails) {
      StateService.setPlaceID(chosenPlaceDetails.place_id);
    }
  }
})();
