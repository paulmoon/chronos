
/**
 * @author Justin Guze
 * @ngdoc directive
 * @name chronosApp.directive:eventCard
 * @description
 * # eventCard
 */

(function() {
angular
  .module('chronosApp')
  .directive('eventcard', eventcard);

  function eventcard() {
    var directive = {
      templateUrl: 'scripts/directives/eventcard.html',
      restrict: 'E',
      scope: {
        title:'=',
        description:'=',
        eventId:'=',
        creator:'=',
        creationDate:'=',
        location:'=',
        startDate:'=',
        endDate:'=',
        vote:'=',
        report:'=',
      },
    };
    return directive
  }

})();