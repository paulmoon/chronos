/**
 * @author Paul Moon
 * @ngdoc directive
 * @name chronosApp:uniqueEmail
 * @description A directive for asynchronously checking whether an email already exists in the database. Checks via
 * an invalid RestService.createUser command with only the email field filled out.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('uniqueEmail', uniqueEmail);

  uniqueEmail.$inject = ['RestService', '$q'];

  /* @ngInject */
  function uniqueEmail(RestService, $q) {
    var directive = {
      link: link,
      require: 'ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
        var email = modelValue || viewValue;
        var deferred = $q.defer();

        RestService.createUser("", "", "", "", email)
          .then(function resolved() {
            deferred.resolve();
          }, function rejected(response) {
            if (response.data.email && response.data.email.indexOf('This field must be unique.') > -1) {
              deferred.reject('Email already exists');
            } else {
              deferred.resolve();
            }
          });

        return deferred.promise;
      };
    }
  }
})();
