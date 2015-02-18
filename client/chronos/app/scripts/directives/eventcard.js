
/**
 * @author Justin Guze
 * @ngdoc directive
 * @name chronosApp.directive:eventCard
 * @description
 * # eventCard
 */

(function() {
'use strict';

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
      controller: 'EventCardController',
        controllerAs: 'vm',
        bindToController: true
    };
    return directive
  };

})();