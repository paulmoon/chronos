/**
 * @author Paul Moon
 * @ngdoc directive
 * @name chronosApp:ShowErrors
 * @description Directive for showing errors when input validation discovers errors
 * Use it on <div> inside <form>.
 * ```html
 * <form role="form" name="myForm">
 *  <div show-input-errors form-submitted="myController.formSubmitted">
 *    <label for="username">Username</label>
 *    <input type="text" id="username">
 *  </div>
 * </form>
 * ```
 * If form-submitted attribute is not passed in to the directive, then input error will be shown
 * to the user even before they interact with the form.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('showInputErrors', showInputErrors);

  function showInputErrors() {
    /* FormSubmitted is an optional binding. If omitted, the input elements will
     show errors (if present) before the user has submitted the form. */
    var directive = {
      restrict: 'EA',
      scope: {
        formSubmitted: '=?formSubmitted'
      },
      link: link
    };

    function link(scope, element, attrs) {
      var input = element.find('input[ng-model]');

      if (input) {
        scope.$watch(function () {
          return input.hasClass('ng-invalid') && scope.formSubmitted;
        }, function (isInvalid) {
          element.toggleClass('has-error', isInvalid);
        });
      }
    }

    return directive;
  }
})();

