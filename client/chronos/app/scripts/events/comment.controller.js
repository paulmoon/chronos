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

CommentController.$inject = ['AuthFacadeService', 'EventFacadeService', '$modal', '$routeParams'];

function CommentController(AuthFacadeService, EventFacadeService, $modal, $routeParams) {
  var vm = this;

  vm.title = 'CommentController';
  vm.comments = [];
  vm.comment = {};
  vm.commentData = '';
  vm.isLoggedIn = AuthFacadeService.isLoggedIn;

  vm.createComment = createComment;
  vm.openLoginModal = openLoginModal;

  _commentActivate();

  /////////

  /**
   * @description This function opens the modal for Login
   * @methodOf chronosApp:CommentController
   */
  function openLoginModal() {
    var modalInstance = $modal.open({
      templateUrl: 'scripts/auth/authModal.html',
      controller: 'AuthModalController as authModal',
      resolve: {
        shouldShowSignUpModal: function () {
          return false;
        }
      }
    });
  }

  /**
   * @description creates new comment
   * @methodOf chronosApp:CommentController
   */
  function createComment() {
    EventFacadeService.saveComment($routeParams.eventId, vm.commentData)
      .then(function (comment) {
        vm.comment.content = comment.content;
        vm.comment.user = {id: comment.user, username: comment.username};
        vm.comment.date = moment(comment.date).format('MMMM Do YYYY, h:mm:ss a');
        vm.comments.unshift(vm.comment);
        vm.commentData = '';
      });
  }

  /**
   * @description on load page it fills in the comment data
   * @methodOf chronosApp:CommentController
   * @private
   */
  function _commentActivate() {
    EventFacadeService.getComment($routeParams.eventId)
      .then(function (comments) {
        vm.comments = comments;
        for (var i = 0, len = vm.comments.length; i < len; ++i) {
          vm.comments[i].date = moment(vm.comments[i].date).format('MMMM Do YYYY, h:mm:ss a');
        }
      });
  }
}
