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

CommentController.$inject = ['AuthService', 'RestService', 'CommentFactory', '$modal', '$routeParams'];

function CommentController(AuthService, RestService, CommentFactory, $modal, $routeParams) {
  var vm = this;

  vm.title = 'CommentController';
  vm.comments = [];
  vm.comment = {};
  vm.commentData = '';
  vm.replyData ='';
  vm.replyOpen = null;
  vm.isLoggedIn = AuthService.isLoggedIn;

  vm.createComment = createComment;
  vm.openLoginModal = openLoginModal;
  vm.isReplyOpen = isReplyOpen;
  vm.isReplyShow = isReplyShow;
  vm.replyCancel = replyCancel;

  _commentActivate();

  /////////

  /**
   * @description This function sets the click to open
   * @methodOf chronosApp:CommentController
   * @param num
   */
  function isReplyOpen(num) {
    vm.replyOpen = num;
  }

  /**
   * @description This function determines to show which form
   * @methodOf chronosApp:CommentController
   * @param num
   */
  function isReplyShow(num) {
    return vm.replyOpen == num ? true : false;
  }

  /**
   * @description This function cancels the reply form
   * @methodOf chronosApp:CommentController
   */
  function replyCancel() {
    vm.replyOpen = null;
  }

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
    CommentFactory.saveComment($routeParams.eventId, vm.commentData)
      .then(function (comment) {
        vm.comment.id = comment.id;
        vm.comment.content = comment.content;
        vm.comment.user = {id: comment.user, username: comment.username};
        vm.comment.date = moment(comment.date).format('MMMM Do YYYY, h:mm:ss a');
        vm.comments.unshift(vm.comment);
        vm.commentData = '';
      });
  }

  /**
   * @description reply to comment
   * @methodOf chronosApp:CommentController
   */
  function replyComment() {
      CommentFactory
  }

  /**
   * @description on load page it fills in the comment data
   * @methodOf chronosApp:CommentController
   * @private
   */
  function _commentActivate() {
    CommentFactory.getComment($routeParams.eventId)
      .then(function (comments) {
        vm.comments = comments;
        for (var i = 0, len = vm.comments.length; i < len; ++i) {
          vm.comments[i].date = moment(vm.comments[i].date).format('MMMM Do YYYY, h:mm:ss a');
        }
      });
  }
}
