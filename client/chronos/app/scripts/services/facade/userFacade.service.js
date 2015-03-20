/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp:UserFacadeService
 * @description UserFacadeService
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('UserFacadeService', UserFacadeService);

  UserFacadeService.$inject = ['RestService'];

  function UserFacadeService(RestService) {
    var self = this;

    this.updateUserLocation = function (chosenPlaceID, chosenPlaceName) {
      return RestService.updateUserLocation(chosenPlaceID, chosenPlaceName);
    };
  }
})();

