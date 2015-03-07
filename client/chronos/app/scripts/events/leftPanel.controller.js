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

  LeftPanelController.$inject = ['$modal', 'EventFactory', 'StateService', 'settings'];

  function LeftPanelController($modal, EventFactory, StateService, settings) {
    var vm = this;

    vm.title = 'LeftPanelController';
    vm.searchKeywords = '';
    vm.searchDateStart = '';
    vm.searchDateEnd = '';
    vm.searchError = '';

    vm.addedTags = '';
    vm.storageTags = [];
    vm.tagError = '';

    vm.getEvents = EventFactory.getSelectedEvents;

    vm.searchEvents = searchEvents;
    vm.updateTags = updateTags;
    vm.updateKeywords = updateKeywords;
    vm.updateStartDate = updateStartDate;
    vm.updateEndDate = updateEndDate;
    vm.resetErrors = resetErrors;

    ////////////////////////////////

    function searchEvents() {
      vm.tagError = '';
      vm.searchError = '';
      var tempKeywords = '';
      var filterParams = {};
      var tempDate = '';

      if (vm.searchKeywords) {
        // removes punctuation, removes extra spaces, and creates an array of the words
        tempKeywords = vm.searchKeywords.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
        if (tempKeywords.length > settings.maxKeywords) {
          vm.searchError = "Max of 10 keywords.";
        } else {
          filterParams.keywords = tempKeywords;
        }
      }

      if (vm.searchDateStart) {
        tempDate = moment(vm.searchDateStart).format("YYYY-MM-DD");

        if (/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(tempDate)) {
          filterParams.fromDate = moment(vm.searchDateStart).utc().format();
        } else {
          vm.searchError = "Incorrect date format.";
        }
      }

      if (vm.searchDateEnd) {
        tempDate = moment(vm.searchDateEnd).format("YYYY-MM-DD");

        if (/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(tempDate)) {
          filterParams.toDate = moment(vm.searchDateEnd).utc().format();
        } else {
          vm.searchError = "Incorrect date format.";
        }
      }

      if (!vm.searchError) {
        EventFactory.updateAllEvents(filterParams);
      }
    }

    function resetErrors() {
      vm.tagError = '';
      vm.searchError = '';
    }

    function updateKeywords() {

    }

    function updateStartDate() {

    }

    function updateEndDate() {

    }

    function updateTags() {
      vm.tagError = '';
      vm.searchError = '';

      vm.storageTags = [];
      var tempTags = [];

      if (vm.addedTags.length > settings.maxNumberTags) {
        vm.tagError = "Max of 5 tags.";
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
          vm.tagError = "Identical Tag Found."
          return;
        }
      });

      EventFactory.updateTags(vm.storageTags);
    }
  }
})();
