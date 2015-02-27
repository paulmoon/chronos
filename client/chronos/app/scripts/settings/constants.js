/**
 * @author Paul Moon
 * @name chronosApp.Constants
 * @description Holds application settings and constant values.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .constant('settings', {
      serverUrl: 'http://localhost:8000',
      eventLimit: 5
    });
})();
