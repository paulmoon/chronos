(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name chronosApp.directive:googleautocomplete
   * @description
   * # googleautocomplete
   */

  angular.module('chronosApp')
    .directive('googleautocomplete', googleautocomplete);
      
  function googleautocomplete() {
    var directive = {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        placeDetails: '=?',
        callback: '=',
        filter: '='
      },
      link: link
    };
    return directive;

    function link (scope, element, attrs, model) {
      var filters = [];
      if (scope.filter) {
        filters = scope.filter;
      }
      var options = {
        types: filters,
        componentRestrictions: {}
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
        scope.$apply(function () {
          scope.placeDetails = scope.gPlace.getPlace();
          model.$setViewValue(element.val());
          console.log(scope.placeDetails);
          scope.callback(scope.placeDetails);
        });
      });
    };
  }

})();