/**
 * @author Paul Moon
 * @name chronosApp.TagsInputProviderConfigs
 * @description Configuration for ngTagsInput
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .config(TagsInputProviderConfigs);

  function TagsInputProviderConfigs(tagsInputConfigProvider) {
    tagsInputConfigProvider.setDefaults('tagsInput', {
      placeholder: 'New tag',
      removeTagSymbol: '✖'
    });
  }
})();
