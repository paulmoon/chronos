'use strict';

/**
 * @author Danny Guan
 * @ngdoc function
 * @name chronosApp.controller:CommentController
 * @description
 * # CommentController
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('CommentController', CommentController);

CommentController.$inject = ['AuthService', 'CommentFactory', '$routeParams'];

function CommentController(AuthService, CommentFactory, $routeParams) {
  var vm = this;
  _commentActivate();
  vm.title = 'CommentController';
  vm.commentData = '';
  vm.isLoggedIn = AuthService.isLoggedIn;

  vm.createComment = createComment;

  /////////

  /**
   * @description creates new comment
   * @methodOf chronosApp:CommentController
   */
  function createComment() {
    CommentFactory.saveComment($routeParams.eventId, vm.commentData)
      .then(function(comment) {
        vm.createdComment = comment
      });
  }

  /**
   * @description on load page it fills in the comment data
   * @methodOf chronosApp:CommentController
   * @private
   */
  function _commentActivate() {
    CommentFactory.getComment($routeParams.eventId)
      .then(function(comments) {
        vm.comments = comments;
        for(var i = 0, len = vm.comments.length; i < len; ++i) {
          vm.comments[i].date = moment(vm.comments[i].date).format('MMMM Do YYYY, h:mm:ss a');
        }
      });
  }
}
