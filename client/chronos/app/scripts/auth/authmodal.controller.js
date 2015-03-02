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
    vm.formSubmitted = false;
    vm.loginFailed = false;

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
        .then(function (response) {
          $modalInstance.close("login");
        }, function (response) {
          vm.loginFailed = true;
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
          AuthService.login(vm.username, vm.password);
          $modalInstance.close();
        }, function (error) {
          console.log("AuthService.signUp failed. This shouldn't happen if our validation logic is correct! " + error);
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
