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
  vm.depth = 0;
  vm.respondTo = null;
  vm.path = null;
  vm.isLoggedIn = AuthService.isLoggedIn;

  vm.createComment = createComment;
  vm.replyComment = replyComment;
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
   * @param depth
   */
  function isReplyOpen(num, depth, path) {
    if(path === null) {
      vm.path = num + '';
    } else {
      vm.path = path + ':' + num;
    }
    vm.respondTo = num;
    vm.depth = depth;
    console.log(vm.path);
  }

  /**
   * @description This function determines to show which form
   * @methodOf chronosApp:CommentController
   * @param num
   */
  function isReplyShow(num) {
    return vm.respondTo == num ? true : false;
  }

  /**
   * @description This function cancels the reply form
   * @methodOf chronosApp:CommentController
   */
  function replyCancel() {
    vm.respondTo = null;
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
        vm.comment.depth = 0;
        vm.comment.path = null;
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
      CommentFactory.replyComment($routeParams.eventId, vm.replyData, vm.depth, vm.path, vm.respondTo)
        .then(function (comments) {
          console.log(comments);
        });
  }

  /**
   * @description on load page it fills in the comment data
   * @methodOf chronosApp:CommentController
   * @private
   */
  function _commentActivate() {
    CommentFactory.getComment($routeParams.eventId)
      .then(function (comments) {
        vm.comments = _commentOrder(comments);
        console.log(vm.comments);
      });
  }

  /**
   * @description loads the format of the comments *note this may be better as a library
   * @methodOf chronosApp:CommentController
   * @param comments
   * @private
   */
  function _commentOrder(comments) {
    var commentDepth0 = [];
    var commentDepth1 = [];
    var commentDepth2 = [];
    var commentDepth3 = [];
    var commentDepth4 = [];

    for(var i = 0, len = comments.length; i < len; ++i) {
      comments[i].replies = [];
      comments[i].date = moment(comments[i].date).format('MMMM Do YYYY, h:mm:ss a');
      if(comments[i].depth === 0) {
        commentDepth0.push(comments[i]);
      } else if(comments[i].depth === 1) {
        commentDepth1.push(comments[i]);
      } else if(comments[i].depth === 2) {
        commentDepth2.push(comments[i]);
      } else if(comments[i].depth === 3) {
        commentDepth3.push(comments[i]);
      } else {
        commentDepth4.push(comments[i]);
      }
    }

    for(var i = 0, len = commentDepth4.length; i < len; ++i) {
      var commentPath = commentDepth4[i].path.split(':');
      for(var j = 0, len2 = commentDepth3.length; j < len2; ++j) {
        if(commentDepth3[j].id == commentPath[3]) {
          commentDepth3[j].replies.push(commentDepth4[i]);
          break;
        }
      }
    }

    for(var i = 0, len = commentDepth3.length; i < len; ++i) {
      for(var j = 0, len2 = commentDepth2.length; j < len2; ++j) {
        if(commentDepth2[j].id == commentDepth3[i].respond_to) {
          commentDepth2[j].replies.push(commentDepth3[i]);
          break;
        }
      }
    }

    for(var i = 0, len = commentDepth2.length; i < len; ++i) {
      for(var j = 0, len2 = commentDepth1.length; j < len2; ++j) {
        if(commentDepth1[j].id == commentDepth2[i].respond_to) {
          commentDepth1[j].replies.push(commentDepth2[i]);
          break;
        }
      }
    }

    for(var i = 0, len = commentDepth1.length; i < len; ++i) {
      for(var j = 0, len2 = commentDepth0.length; j < len2; ++j) {
        if(commentDepth0[j].id == commentDepth1[i].respond_to) {
          commentDepth0[j].replies.push(commentDepth1[i]);
          break;
        }
      }
    }

    return commentDepth0;
  }
}
