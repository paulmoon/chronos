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

  LeftPanelController.$inject = ['RestService', '$modal', 'StateService'];

   function LeftPanelController(RestService, $modal, StateService) {
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

      vm.events = [];

      vm.searchEvents = searchEvents;
      vm.removeTag = removeTag;
      vm.addTags = addTags;

      ////////////////////////////////

      function searchEvents() {
         vm.tagError = '';
         vm.searchError = '';
         var tempKeywords = '';

         if(vm.searchKeywords){
            // removes punctuation, removes extra spaces, and creates an array of the words
            tempKeywords = vm.searchKeywords.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ");
            if(tempKeywords.length > 10){
               vm.searchError = "Max of 10 keywords.";
            } else {
               StateService.setKeywords(tempKeywords);
            }
         } else {
            StateService.setKeywords(tempKeywords);
         }

         if(vm.searchDateStart){
            // regex for the date format 2015-01-01
            if(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(vm.searchDateStart)){
               StateService.setDateRangeStart(vm.searchDateStart);
            }else {
               vm.searchError = "Incorrect date format.";
            }
         } else {
            StateService.setDateRangeStart(vm.searchDateStart);
         }

         if(vm.searchDateEnd){
            if(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.exec(vm.searchDateEnd)){
               StateService.setDateRangeEnd(vm.searchDateEnd);
            }else {
               vm.searchError = "Incorrect date format.";
            }
         } else {
            StateService.setDateRangeEnd(vm.searchDateEnd);
         }

         if(vm.searchError){
            vm.events = [];
         }else{
            RestService.getFilteredEvents().
            success(function(data, status, headers, config) {
               vm.events = data;
            }).
            error(function(data, status, headers, config) {
               vm.events = [];
               vm.searchError = "Search Failed.";
            });
         }
      }

      function removeTag(tag){
         var count = 0;

         vm.displayTags.forEach(function(tag2) {
            if(tag == tag2){
               vm.displayTags.splice(count, 1);
               vm.storageTags.splice(count, 1);
            }
            count = count + 1;
         });

         StateService.setTags(vm.storageTags);
      }

      function addTags(){
         vm.tagError = '';
         vm.searchError = '';
         var tempTags = '';

         if(vm.addedTags){
            tempTags = vm.addedTags.split(" ");

            tempTags.forEach(function(tag) {
               var noMatch = true;
               var displayTag = tag;

               if(tag.length > 50){
                  vm.tagError = "Max tag length of 50 characters.";
                  return;
               }

               if(vm.displayTags.length > 4){
                  vm.tagError = "Max of 5 tags.";
                  return;
               }

               vm.storageTags.forEach(function(tag2) {
                  if(tag == tag2){
                     noMatch = false;
                  }
               });

               if(noMatch){
                  if(tag.length > 10){
                     displayTag = tag.substring(0,9) + "...";
                  }

                  vm.displayTags.forEach(function(tag3) {
                     if(displayTag == tag3){
                        displayTag = displayTag + ".";
                     }
                  });

                  vm.displayTags.push(displayTag);
                  vm.storageTags.push(tag);
               }else{
                  noMatch = true;
               } 
            });

            StateService.setTags(vm.storageTags);
            vm.addedTags = '';
         }
      }
   }
})();
