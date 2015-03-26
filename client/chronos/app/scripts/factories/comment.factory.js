/**
 * @author Danny Guan
 * @ngdoc function
 * @name chronosApp:CommentFactory
 * @description provider for the comments in event page
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .factory('CommentFactory', CommentFactory);

  CommentFactory.$inject = ['RestService', '$q', '$log'];

  function CommentFactory(RestService, $q, $log) {
    var factory =  {
      comments: [],
      getComment: getComment,
      saveComment: saveComment,
      retrieveComment: retrieveComment
    };

    return factory;

    //////////////////////

    /**
     * @description Returns comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @param eventId
     * @returns {*}
     */
    function getComment() {
      return factory.comments;
    }

    function retrieveComment(eventId) {
      _updateComment(eventId);
    }

    /**
     * @description saves comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @param eventId
     * @param commentData
     * @returns {*}
     */
    function saveComment(eventId, commentData, depth, path, parent) {
      return RestService.saveComment(eventId, commentData, depth, path, parent)
        .then(function(response) {
          _updateComment(eventId);
          return response.data;
        }, function(response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }

    /**
     * @description updates comments that the factory holds
     * @methodOf chronosApp:CommentFactory
     * @returns private {*}
     */
    function _updateComment(eventId) {
      return RestService.getComment(eventId)
        .then(function(response) {
          var comments = response.data;
          factory.comments = comments;
          return response.data;
        }, function (response) {
          $log.warn('Failed to retrieve comments');
          $log.warn(response);
          return $q.reject(response);
        });
    }

    /**
     * @description deletes comments that the factory holds
     * @methodOf chronosApp:CommentFactory
     * @returns {*}
     */
    function deleteComment() {

    }

  }
})();
