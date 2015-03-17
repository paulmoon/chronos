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
  vm.isLoggedIn = AuthService.isLoggedIn;

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

    modalInstance.result.then(vm.onLogin);
  }

  /**
   * @description Function called when the user just logs into the system. Currently,
   * it only gets the user's place id, correlates it to a place, and puts that string in the autocomplete
   * box.
   * @methodOf chronosApp:CommentController
   */

  function onLogin() {
    RestService.getCurrentUserInformation()
      .success(function (data, status, headers, config) {
        if (data.place_id === null) {
          return;
        }

        var request = {
          placeId: data.place_id
        };

        var service = new google.maps.places.PlacesService($scope._element);

        service.getDetails(request, function (place, status) {
          if (status === 'OK') {
            _updateLocationDetails(place.place_id);
            vm.chosenPlace = place.formatted_address;
          }
        });
      })
      .error(function (data, status, headers, config) {
        console.log("Couldn't get user information. Not doing any onLogin work");
      });
  }

  /**
   * @description creates new comment
   * @methodOf chronosApp:CommentController
   */
  function createComment() {
    CommentFactory.saveComment($routeParams.eventId, vm.commentData)
      .then(function(comment) {
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
    CommentFactory.getComment($routeParams.eventId)
      .then(function(comments) {
        vm.comments = comments;
        for(var i = 0, len = vm.comments.length; i < len; ++i) {
          vm.comments[i].date = moment(vm.comments[i].date).format('MMMM Do YYYY, h:mm:ss a');
        }
      });
  }
}
