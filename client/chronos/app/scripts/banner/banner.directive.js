/**
 * @ngdoc directive
 * @name chronosApp.directive:banner
 * @description
 * # banner
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('banner', banner);

  function banner() {
    var directive = {
      templateUrl: 'scripts/banner/banner.html',
      restrict: 'E'
    };

    return directive;
  }
})();
