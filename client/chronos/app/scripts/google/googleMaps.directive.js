(function () {
  'use strict';

  /**
   * @author Paul Moon
   * @ngdoc directive
   * @name chronosApp.directive:GoogleMaps
   * @description Directive with an empty div used for Google Maps API, Places library. It requires a
   */
  angular
    .module('chronosApp')
    .directive('GoogleMaps', GoogleMaps);

  GoogleMaps.$inject = ['GoogleMapsFactory'];

  function GoogleMaps() {
    var directive = {
      restrict: 'AE',
      link: link
    };
    return directive;

    function link(scope, element, attrs, model) {
      // This is grabbing the #empty div in the HTML to use as a placeholder map
      scope._element = element[0].querySelector('.empty');
    }
  };
})();
