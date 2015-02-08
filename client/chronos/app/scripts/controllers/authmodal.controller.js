/**
 * @author Paul Moon
 * @ngdoc function
 * @name chronosApp:AuthModalController
 * @description ViewModel for the banner including logo, "Choose a Location", and user authentication (login/log out)
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('AuthModalController', AuthModalController);

  AuthModalController.$inject = ['$modalInstance', 'AuthService', 'shouldShowSignUpModal'];

  function AuthModalController($modalInstance, AuthService, shouldShowSignUpModal) {
    var vm = this;

    vm.title = 'AuthModalController';
    vm.username = '';
    vm.password = '';
    vm.firstName = '';
    vm.lastName = '';
    vm.email = '';
    vm.shouldShowSignUpModal = shouldShowSignUpModal;

    vm.login = login;
    vm.signUp = signUp;
    vm.cancel = cancel;

    ////////////////

    /**
     * @description Calls {@link chronosApp:AuthService#login}|AuthService.login} to login.
     * @methodOf chronosApp:AuthModalController
     */
    function login() {
      vm.shouldShowSignUpModal = false;

      AuthService.login(vm.username, vm.password)
        .then(function (data) {
          $modalInstance.close();
        }, function (response) {
          // TODO: Show UI error on wrong password.
          console.log("AuthService.login failed");
        });
    }

    /**
     * @description Calls {@link chronosApp:AuthService#signUp}|AuthService.signUp} to create a user account.
     * @methodOf chronosApp:AuthModalController
     */
    function signUp() {
      vm.shouldShowSignUpModal = true;

      AuthService.signUp(vm.username, vm.firstName, vm.lastName, vm.password, vm.email)
        .then(function (data) {
          $modalInstance.close();
        }, function (error) {
          // TODO: Show UI error on Sign Up.
          console.log("AuthService.signUp failed");
        });
    }

    /**
     * @description Closes the modal window.
     * @methodOf chronosApp:AuthModalController
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
