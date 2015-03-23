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

  AuthModalController.$inject = ['$log', '$modalInstance', 'AuthFacadeService', 'shouldShowSignUpModal'];

  function AuthModalController($log, $modalInstance, AuthFacadeService, shouldShowSignUpModal) {
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

    vm.loading = false;
    vm.loadingBlurStyle = {
      opacity: 1
    };

    ////////////////

    /**
     * @description Calls {@link chronosApp:AuthService#login}|AuthService.login} to login.
     * @methodOf chronosApp:AuthModalController
     */
    function login() {
      vm.shouldShowSignUpModal = false;
      vm.loading = true;
      vm.loadingBlurStyle = {
        opacity: 0.4
      };

      AuthFacadeService.login(vm.username, vm.password)
        .then(function (response) {
          $modalInstance.close("login");
          vm.loading = false;
          vm.loadingBlurStyle = {
            opacity: 1
          };
        }, function (response) {
          vm.loginFailed = true;
          vm.loading = false;
          vm.loadingBlurStyle = {
            opacity: 1
          };
        });
    }

    /**
     * @description Calls {@link chronosApp:AuthService#signUp}|AuthService.signUp} to create a user account.
     * @methodOf chronosApp:AuthModalController
     */
    function signUp() {
      vm.shouldShowSignUpModal = true;
      vm.loading = true;
      vm.loadingBlurStyle = {
        opacity: 0.4
      };

      AuthFacadeService.createUser(vm.username, vm.firstName, vm.lastName, vm.password, vm.email)
        .then(function (data) {
          return AuthFacadeService.login(vm.username, vm.password)
            .then(function (response) {
              $modalInstance.close();
              vm.loading = false;
              vm.loadingBlurStyle = {
                opacity: 1
              };
            }, function (response) {
              $modalInstance.close();
              vm.loading = false;
              vm.loadingBlurStyle = {
                opacity: 1
              };
            });
        }, function (error) {
          vm.loading = false;
          vm.loadingBlurStyle = {
            opacity: 1
          };
          $log.warn("AuthService.signUp failed. This shouldn't happen if our validation logic is correct! " + error);
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
