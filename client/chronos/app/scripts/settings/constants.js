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
      maxKeywords: 10,
      maxTagLength: 50,
      maxNumberTags: 5,
      calendarEventLimitPerDay: 4,

      pubSubOnLogin: 'pubSubOnLogin',
      pubSubOnLogout: 'pubSubOnLogout',
      pubSubOnSignUp: 'pubSubOnSignUp',
      pubSubOnEventCreate: 'pubSubOnEventCreate',
      pubSubOnEventUpdate: 'pubSubOnEventUpdate',
      pubSubOnCommentCreate: 'pubSubOnCommentCreate'
    });
})();
