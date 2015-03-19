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
      template: "<ul class='comment-list'><childcomment data-ng-repeat='childcomment in comment' childcomment='childcomment'></childcomment></ul>"
    };
    return directive
  };

})();
