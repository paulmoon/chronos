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
  vm.replyData = '';
  vm.depth = 0;
  vm.childOf = null;
  vm.path = null;
  vm.isLoggedIn = AuthFacadeService.isLoggedIn;

  vm.createComment = createComment;
  vm.setCommentDateFormat = setCommentDateFormat;
  vm.replyComment = replyComment;
  vm.openLoginModal = openLoginModal;
  vm.isReplyOpen = isReplyOpen;
  vm.isReplyShow = isReplyShow;
  vm.replyCancel = replyCancel;
  vm.comments = EventFacadeService.getComment;

  /////////

  /**
   * @description This function sets the values for reply to comment when sending to saveComment end point
   * @methodOf chronosApp:CommentController
   * @param num
   * @param depth
   */
  function isReplyOpen(num, depth) {
    vm.path = num;
    vm.childOf = num;
    vm.depth = depth + 1;
  }

  /**
   * @description This function determines to show which form
   * @methodOf chronosApp:CommentController
   * @param num
   */
  function isReplyShow(num) {
    return vm.childOf == num;
  }

  /**
   * @description This function cancels the reply form
   * @methodOf chronosApp:CommentController
   */
  function replyCancel() {
    vm.childOf = null;
  }

  /**
   * @description sets the datetime format for the comment's datetime value
   * @methodOf chronosApp:CommentController
   * @param datetime
   * @returns {*}
   */
  function setCommentDateFormat(datetime) {
    return moment(datetime).format('MMMM Do YYYY, h:mm:ss a');
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
    EventFacadeService.saveComment($routeParams.eventId, vm.commentData, 0, null, null)
      .then(function (comment) {
        vm.commentData = '';
      });
  }

  /**
   * @description reply to comment
   * @methodOf chronosApp:CommentController
   */
  function replyComment() {
    EventFacadeService.saveComment($routeParams.eventId, vm.replyData, vm.depth, vm.path, vm.childOf)
      .then(function (comment) {
        vm.replyData = '';
        vm.childOf = null;
      });
  }
}
