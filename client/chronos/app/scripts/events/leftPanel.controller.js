/**
 * @author Mark Roller
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

  LeftPanelController.$inject = ['$modal', 'EventFactory', 'StateService', 'settings'];

  function LeftPanelController($modal, EventFactory, StateService, settings) {
    var vm = this;

    vm.title = 'LeftPanelController';
    vm.searchKeywords = '';
    vm.searchError = '';
    vm.storageTags = [];
    vm.addedTags = '';

    vm.getEvents = EventFactory.getSelectedEvents;
    //vm.addedTags = EventFactory.getTags;

    vm.searchEvents = searchEvents;
    vm.updateTags = updateTags;
    vm.updateKeywords = updateKeywords;
    vm.updateStartDate = updateStartDate;
    vm.updateEndDate = updateEndDate;
    vm.getLastSunday = getLastSunday;
    vm.clearStartDate = clearStartDate;
    vm.clearEndDate = clearEndDate;
    vm.clearKeywords = clearKeywords;

    vm.searchDateStart = vm.getLastSunday(moment().local().startOf('month'));
    vm.searchDateEnd = vm.getLastSunday(moment().local().startOf('month')).add(6, 'weeks');

    ////////////////////////////////

    /**
     * @description Returns the date of a Sunday used for the initial dates shown
     * @methodOf chronosApp:LeftPanelController
     * @returns the moment for the sunday before the date provided
     */
    function getLastSunday(providedDate) {
      if(providedDate.isoWeekday() == 7){
        return providedDate;
      }

      var daystoLastSunday = providedDate.isoWeekday();
      var lastSunday = providedDate.subtract(daystoLastSunday, 'days');

      return lastSunday;
    }

    /**
     * @description Called by the apply filters button and sets the 
     * events according to all search parameters
     * @methodOf chronosApp:LeftPanelController
     */
    function searchEvents() {
      vm.searchError = '';
      var tempKeywords = '';
      var filterParams = {};

      if (vm.searchKeywords) {
        tempKeywords = vm.searchKeywords.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
        if (tempKeywords.length > settings.maxKeywords) {
          vm.searchError = "Max of 10 keywords.";
        } else {
          filterParams.keywords = tempKeywords;
        }
      }

      if (vm.searchDateStart) {
        filterParams.fromDate = moment(vm.searchDateStart).utc();
      }

      if (vm.searchDateEnd) {
        filterParams.toDate = moment(vm.searchDateEnd).utc();
      }

      if (!vm.searchError) {
        EventFactory.updateEvents(filterParams);
      }
    }

    /**
     * @description Clears the displayed Keywords
     * @methodOf chronosApp:LeftPanelController
     */
    function clearKeywords() {
      vm.searchKeywords = '';
      vm.updateKeywords();
    }

    /**
     * @description Clears the displayed start date
     * @methodOf chronosApp:LeftPanelController
     */
    function clearStartDate() {
      vm.searchDateStart = '';
      vm.updateStartDate();
    }

    /**
     * @description Clears the displayed end date
     * @methodOf chronosApp:LeftPanelController
     */
    function clearEndDate() {
      vm.searchDateEnd = '';
      vm.updateEndDate();
    }

    /**
     * @description Updates the keyords field and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateKeywords() {
      if(vm.searchKeywords){
        vm.searchError = '';
        var tempKeywords = '';

        tempKeywords = vm.searchKeywords.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");

        if (tempKeywords.length > settings.maxKeywords) {
          vm.searchError = "Max of 10 keywords.";
        } else {
          EventFactory.updateKeywords(tempKeywords);
        }
      } else{
        vm.searchEvents();
      }
    }

    /**
     * @description Updates the start date and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateStartDate() {
      if(vm.searchDateStart){
        var fromDate = moment(vm.searchDateStart).utc();
        EventFactory.updateDateRangeStart(fromDate);
      } else{
        vm.searchEvents();
      }
    }

    /**
     * @description Updates the end date and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateEndDate() {
      if(vm.searchDateEnd){
        var toDate = moment(vm.searchDateEnd).utc();
        EventFactory.updateDateRangeEnd(toDate);
      } else {
        vm.searchEvents();
      }
    }

    /**
     * @description Updates the tagsand updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateTags() {
      vm.searchError = '';

      vm.storageTags = [];
      var tempTags = [];

      if (vm.addedTags.length > settings.maxNumberTags) {
        vm.addedTags.splice(-1,1);
        vm.searchError = "Max of 5 tags.";
        return;
      }
      
      vm.addedTags.forEach(function (tag) {
        tempTags.push(tag.name);
      });

      tempTags.forEach(function (tag) {
        var noMatch = true;

        vm.storageTags.forEach(function (tag2) {
          if (tag === tag2) {
            noMatch = false;
          }
        });

        if (noMatch) {
          vm.storageTags.push(tag);
        } else {
          vm.searchError = "Identical Tag Found."
          return;
        }
      });

      EventFactory.updateTags(vm.storageTags);
    }
  }
})();
