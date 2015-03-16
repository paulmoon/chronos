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
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    return comment;

    //////////////////////

    /**
     * @description Returns comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @returns Get event in the CommentFactory.
     */
    function getComment() {

    }

    /**
     * @description saves comments that the factory holds.
     * @methodOf chronosApp:CommentFactory
     * @returns {*}
     */
    function saveComment() {

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
