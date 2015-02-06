angular
  .module('chronosApp')
  .controller('AuthModalController', AuthModalController);

AuthModalController.$inject = ['$modalInstance', 'AuthService', 'shouldShowSignUpModal'];

/* @ngInject */
function AuthModalController($modalInstance, AuthService, shouldShowSignUpModal) {
  /* jshint validthis: true */
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

  function login() {
    vm.shouldShowSignUpModal = false;

    AuthService.login(vm.username, vm.password)
      .then(function (data) {
        AuthService.setCredentials(vm.username, vm.password);
        $modalInstance.close();
      }, function (response) {
        // TODO: Show UI error on wrong password.
        console.log("AuthService.login failed");
      });
  }

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

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}

