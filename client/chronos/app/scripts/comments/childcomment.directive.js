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

  function childcomment($compile) {

    var template = "<li class='comment-container comment-depth'>" +
      "<div class='comment-header'>" +
      "<span class='comment-username'>{{childcomment.user.username}}</span> - <span class='comment-reply'><a data-ng-click='vm.isReplyOpen(childcomment.id, childcomment.depth, childcomment.path)'>Reply</a></span>" +
      "<div data-ng-show='vm.isReplyShow(childcomment.id)' class='comment-save-body'>" +
      "<form role='form'>" +
      "<div class='form-group'>" +
      "<textarea class='form-control' rows='8' id='reply-description' placeholder='Comment' data-ng-model='vm.replyData'>" +
      "</textarea>" +
      "</div>" +
      "<a type='submit' class='btn btn-primary comment-save-submit' data-ng-click='vm.replyComment()'>Reply</a>" +
      "<a type='submit' class='btn btn-warning comment-save-submit comment-cancel' data-ng-click='vm.replyCancel()'>Cancel</a>" +
      "</form>" +
      "</div>" +
      "</div>" +
      "<div class='comment-body'>" +
      "{{childcomment.content}}" +
      "</div>" +
      "<div class='comment-date'>" +
      "{{vm.setCommentDateFormat(childcomment.date)}}" +
      "</div>" +
      "</li>";

    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        childcomment: '='
      },
      controller: 'CommentController',
      controllerAs: 'vm',
      template: template,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var commentStatement = "<comment comment='childcomment.children'></comment>";
      if (angular.isArray(scope.childcomment.children)) {
        $compile(commentStatement)(scope, elementAppend);

        function elementAppend(cloned, scope) {
          element.append(cloned);
        };
      }
    }

  };

})();
