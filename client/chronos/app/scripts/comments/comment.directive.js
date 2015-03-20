/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:comment
 * @description
 * # comment
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('comment', comment);

  function comment() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        comment: '='
      },
      templateUrl: 'scripts/comments/rootcomment.html'
    };
    return directive;
  }

})();
