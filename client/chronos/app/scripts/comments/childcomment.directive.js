/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:childcomment
 * @description
 * # comment's children
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('childcomment', childcomment);

  childcomment.$inject = ['$compile'];

  function childcomment($compile) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        childcomment: '='
      },
      controller: 'CommentController',
      controllerAs: 'vm',
      templateUrl: 'scripts/comments/comment.html',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var commentStatement = "<comment comment='childcomment.children'></comment>";
      if (angular.isArray(scope.childcomment.children)) {
        $compile(commentStatement)(scope, elementAppend);

        function elementAppend(cloned, scope) {
          element.append(cloned);
        }
      }
    }
  }
})();
