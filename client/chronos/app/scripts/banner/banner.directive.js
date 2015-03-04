/**
 * @ngdoc directive
 * @name chronosApp.directive:banner
 * @description
 * # banner
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('banner', banner);

    function banner() {
    	var directive = {
    		templateUrl: 'scripts/banner/banner.html',
    		restrict: 'E',
    		link: link
    	};
    	return directive;

    function link(scope, element, attrs) {
    		// This is grabbing the #empty div in the HTML to use as a placeholder map 
    		angular.forEach(element[0].childNodes, function(child) {
    			if (child.className == "empty")
    			{
    				scope._element = child;
    			}
    		});
    	}
    }
})();
