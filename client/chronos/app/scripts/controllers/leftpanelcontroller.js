/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp.controller:LeftPanelController
 * @description
 * # LeftPanelController
 * Controller of the chronosApp
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('LeftPanelController', LeftPanelController);

  LeftPanelController.$inject = ['RestService', '$modal'];

   function LeftPanelController(RestService, $modal) {
      var vm = this;

      vm.title = 'LeftPanelController';
      vm.events = [];

      vm.searchEvents = searchEvents;
      vm.openCreateEventModal = openCreateEventModal;

      function searchEvents() {
         RestService.getFilteredEvents().
            success(function(data, status, headers, config) {
               vm.events = data;
            }).
            error(function(data, status, headers, config) {
               // Fill in at later date
            });
      }

   function openCreateEventModal() {
      var modalInstance = $modal.open({
        templateUrl: 'views/eventModal.html',
        controller: 'EventModalController as eventModal',
        size: 'lg',
        resolve: {
          shouldShowEventCreateModal: function () {
            return true;
          }
        }
      });
    }
   }
})();
