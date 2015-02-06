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
  vm.confirmPassword = '';
  vm.firstName = '';
  vm.lastName = '';
  vm.email = '';
  vm.shouldShowSignUpModal = shouldShowSignUpModal;

  vm.login = login;
  vm.signUp = signUp;
  vm.cancel = cancel;

  ////////////////

  function login() {
    console.log('username: ' + vm.username);
    console.log('password: ' + vm.password);
    console.log('LOGGIN IN');

    console.log($modalInstance);
    console.log(AuthService);
    vm.shouldShowSignUpModal = false;

    AuthService.login(vm.username, vm.password)
      .then(function (data) {
        AuthService.setCredentials(vm.username, vm.password);
        console.log('correctly signed in' + data);
      }, function (response) {
        // Display an incorrect password message.
        console.log('Incorrect password' + response);
      });
  }

  function signUp() {
    console.log('Signing up.');

    vm.shouldShowSignUpModal = true;

    AuthService.signUp(vm.username, vm.password)
      .then(function (data) {
        console.log('signUp success');
      }, function (error) {
        console.log('signUp failure');
      });
  }

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}

