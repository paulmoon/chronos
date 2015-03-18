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

  CommentFactory.$inject = ['RestService', '$route', '$q', '$log'];

  function CommentFactory(RestService, $route, $q, $log) {
    var comment =  {
      getComment: getComment,
      saveComment: saveComment,
      replyComment: replyComment,
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    return comment;

    //////////////////////

    /**
     * @description Returns comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @param eventId
     * @returns {*}
     */
    function getComment(eventId) {
      return RestService.getComment(eventId)
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }

    /**
     * @description saves comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @param eventId
     * @param commentData
     * @returns {*}
     */
    function saveComment(eventId, commentData) {
      return RestService.saveComment(eventId, commentData)
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }

    /**
     * @description saves replies to comments
     * @methodOf chronosApp:CommentFactory
     * @param eventId
     * @param replyData
     * @param depth
     * @param respondTo
     * @returns {*}
     */
    function replyComment(eventId, replyData, depth, respondTo) {
      return RestService.saveReply(eventId, replyData, depth, respondTo)
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }

    /**
     * @description updates comments that the factory holds
     * @methodOf chronosApp:CommentFactory
     * @returns {*}
     */
    function updateComment() {

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
