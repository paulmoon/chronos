/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:restrictMaxTags.directive.js
 * @description enforces the ngTagsInput to adhere to the max tag attribute and disable input commands
 */
(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('restrictMaxTags', restrictmaxtags);

  function restrictmaxtags() {
    var KEY_BACKSPACE = 8,
      KEY_TAB = 9,
      directive = {
        require: "ngModel",
        priority: -10,
        link: link
      };
    return directive;

    function link($scope, $element, $attrs, ngModelController) {
      var tagsInputScope = $element.isolateScope(),
        maxTags,
        getTags,
        checkTags,
        maxTagsReached,
        input = $element.find('input'),
        placeholder;

      $attrs.$observe('maxTags', function (_maxTags) {
        maxTags = _maxTags;
      });

      getTags = function () {
        return ngModelController.$modelValue;
      };

      /**
       * trigger the autocomplete to hide
       * use max-width to avoid conflicts with the tiAutosize
       * directive that ngTagsInput uses
       */
      checkTags = function () {
        var tags = getTags();
        if (tags && tags.length && tags.length >= maxTags && !maxTagsReached) {
          tagsInputScope.events.trigger('input-blur');
          placeholder = input.attr('placeholder');
          input.attr('placeholder', '');
          input.css('max-width', '0');
          maxTagsReached = true;
        } else if (maxTagsReached) {
          input.attr('placeholder', placeholder);
          input.css('max-width', '');
          maxTagsReached = false;
        }
      };

      $scope.$watchCollection(getTags, checkTags);

      // prevent any keys from being entered into
      // the input when max tags is reached
      input.on('keydown', function (event) {
        if (maxTagsReached && event.keyCode !== KEY_BACKSPACE && event.keyCode !== KEY_TAB) {
          event.stopImmediatePropagation();
          event.preventDefault();
        }
      });

      // prevent the autocomplete from being triggered
      input.on('focus', function (event) {
        checkTags();
        if (maxTagsReached) {
          tagsInputScope.hasFocus = true;
          event.stopImmediatePropagation();
        }
      });
    }
  }
})();
