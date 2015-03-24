/**
 * @ngdoc function
 * @name chronosApp.controller:LoadingcontrollerCtrl
 * @description loading animation controller
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('LoadingController', LoadingController);

  function LoadingController() {
    var vm = this;

    // Change this to determine what loading icon to use
    // 1 = Spinning loading bar with an e in it
    // 2 = Three balls in a row
    // 3 = Two spining rings
    vm.loaderNumber = 3;
  }
})();
