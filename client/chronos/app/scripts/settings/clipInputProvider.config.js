/**
 * @author Paul Moon
 * @name chronosApp.ClipInputProvider
 * @description Set the path for th zero clip board swf file.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .config(ClipInputConfigs);

  ClipInputConfigs.$inject = ['ngClipProvider'];

  function ClipInputConfigs(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }
})();
