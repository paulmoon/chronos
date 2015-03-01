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
      tagDisplayLength: 10,
      maxKeywords: 10,
      maxTagLength: 50,
      maxNumberTags: 4,
      calendarEventLimitPerDay: 4
    });
})();
