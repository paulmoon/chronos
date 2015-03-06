/**
 * @author Justin Guze
 * @ngdoc directive
 * @name chronosApp.directive:eventCard
 * @description
 * # eventCard
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('eventcard', eventcard);

  function eventcard() {
    var directive = {
      templateUrl: 'scripts/events/eventCard.html',
      restrict: 'E',
      scope: {
        eventName: '=',
        description: '=',
        eventId: '=',
        creator: '=',
        creationDate: '=',
        placeId: '=',
        placeName: '=',
        startDate: '=',
        endDate: '=',
        vote: '=',
        report: '=',
        tags:'=',
        editDate:'=',
        picture:'=',
      },
      controller: 'EventCardController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive
  };

})();
