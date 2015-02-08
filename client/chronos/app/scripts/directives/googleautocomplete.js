'use strict';

/**
 * @ngdoc directive
 * @name chronosApp.directive:googleautocomplete
 * @description
 * # googleautocomplete
 */
 
angular.module('chronosApp')
  .directive('googleautocomplete', function () {
    return {
      require: 'ngModel',
      scope: {
      	ngModel:'=',
      	details: '=?',
      	callback: '=',
      },
      link: function(scope, element, attrs, model) {
        var options = {
        	types: [],
        	componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
        	scope.$apply(function() {
        		scope.details = scope.gPlace.getPlace();
        		model.$setViewValue(element.val());
        		scope.callback(scope.details);
        	});
        });
      }
    };
  });
