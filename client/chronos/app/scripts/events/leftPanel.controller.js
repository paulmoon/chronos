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
    vm.displayTags = [];
    vm.storageTags = [];
    vm.tagError = '';

    vm.getEvents = EventFactory.getSelectedEvents;

    vm.searchEvents = searchEvents;
    vm.removeTag = removeTag;
    vm.addTags = addTags;

    ////////////////////////////////

    function searchEvents() {
      vm.tagError = '';
      vm.searchError = '';
      var tempKeywords = '';
      var filterParams = {};
      var extraParams = [];

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
        // regex for the date format 2015-01-01
        if (/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(vm.searchDateStart)) {
          filterParams.fromDate = moment(vm.searchDateStart);
        } else {
          vm.searchError = "Incorrect date format.";
        }
      }

      if (vm.searchDateEnd) {
        if (/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(vm.searchDateEnd)) {
          filterParams.toDate = moment(vm.searchDateEnd);
        } else {
          vm.searchError = "Incorrect date format.";
        }
      }

      if (vm.searchError) {
        EventFactory.events = [];
      } else {
        EventFactory.updateEvents(filterParams, extraParams);
      }
    }

    function removeTag(tag) {
      var count = 0;

      vm.displayTags.forEach(function (tag2) {
        if (tag == tag2) {
          vm.displayTags.splice(count, 1);
          vm.storageTags.splice(count, 1);
        }
        count = count + 1;
      });

      EventFactory.updateTags(vm.storageTags);
    }

    function addTags() {
      vm.tagError = '';
      vm.searchError = '';
      var tempTags = '';

      if (vm.addedTags) {
        tempTags = vm.addedTags.split(" ");

        tempTags.forEach(function (tag) {
          var noMatch = true;
          var displayTag = tag;

          if (tag.length > settings.maxTagLength) {
            vm.tagError = "Max tag length of 50 characters.";
            return;
          }

          if (vm.displayTags.length > settings.maxNumberTags) {
            vm.tagError = "Max of 5 tags.";
            return;
          }

          vm.storageTags.forEach(function (tag2) {
            if (tag === tag2) {
              noMatch = false;
            }
          });

          if (noMatch) {
            if (tag.length > settings.tagDisplayLength) {
              displayTag = tag.substring(0, 9) + "...";
            }

            vm.displayTags.forEach(function (tag3) {
              if (displayTag === tag3) {
                displayTag = displayTag + ".";
              }
            });

            vm.displayTags.push(displayTag);
            vm.storageTags.push(tag);
          } else {
            noMatch = true;
          }
        });

        EventFactory.updateTags(vm.storageTags);
        vm.addedTags = '';
      }
    }
  }
})();
