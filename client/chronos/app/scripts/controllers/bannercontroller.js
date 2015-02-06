/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:BannerController
 * @description
 * BannerController
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('BannerController', BannerController);

  BannerController.$inject = ['StateService', '$modal'];

  function BannerController(StateService, $modal) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = null;

    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;

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

    function changeLocation() {
      // Save location to StateService. Change filters, etc
      console.log(vm.chosenPlace);
    }
  }
})();
