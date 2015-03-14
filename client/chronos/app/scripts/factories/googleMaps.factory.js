/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.GoogleMapsFactory
 * @description Factory used
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .factory('GoogleMapsFactory', GoogleMapsFactory);

  //GoogleMapsFactory.$inject = [];

  /* @ngInject */
  function GoogleMapsFactory() {
    var factory = {
      divElement: undefined,

      setDivElement: setDivElement,
      getDivElement: getDivElement
    };

    return factory;

    //////////////////////

    /**
     * @description Returns the events that the factory holds.
     * @methodOf chronosApp:EventFactory
     * @returns List of events in the EventFactory.
     */
    function setDivElement(divElement) {
      factory.divElement = divElement;
    }

    /**
     * @description Returns the events that the factory holds.
     * @methodOf chronosApp:EventFactory
     * @returns List of events in the EventFactory.
     */
    function getDivElement() {
      return factory.divElement;
    }
  }
})();
