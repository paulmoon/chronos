/**
 * @author Paul Moon
 * @ngdoc directive
 * @name chronosApp:uniqueUsername
 * @description A directive for asynchronously checking whether a username already exists in the database. Checks via
 * an invalid RestService.createUser command with only the username field filled out.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('uniqueUsername', uniqueUsername);

  uniqueUsername.$inject = ['AuthFacadeService', '$q'];

  /* @ngInject */
  function uniqueUsername(AuthFacadeService, $q) {
    var directive = {
      link: link,
      require: 'ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
        var username = modelValue || viewValue;
        var deferred = $q.defer();

        AuthFacadeService.createUser(username, "", "", "", "")
          .then(function resolved() {
            deferred.resolve();
          }, function rejected(response) {
            if (response.data.username && response.data.username.indexOf('This field must be unique.') > -1) {
              deferred.reject('Username already exists');
            } else {
              deferred.resolve();
            }
          });

        return deferred.promise;
      };
    }
  }
})();
