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

  LeftPanelController.$inject = ['EventFacadeService', 'NotificationService', 'PubSubService', 'settings'];

  function LeftPanelController(EventFacadeService, NotificationService, PubSubService, settings) {

    var vm = this;

    vm.title = 'LeftPanelController';
    vm.searchKeywords = '';
    vm.searchError = '';
    vm.storageTags = [];
    vm.addedTags = [];
    vm.popularTags = [];

    vm.loading = false;
    vm.getEvents = EventFacadeService.getSelectedEvents;
    vm.votedEventDirection = {};
    vm.savedEvents = {};
    vm.reportedEvents = {};

    vm.searchEvents = searchEvents;
    vm.updateTags = updateTags;
    vm.updateKeywords = updateKeywords;
    vm.updateStartDate = updateStartDate;
    vm.updateEndDate = updateEndDate;
    vm.getLastSunday = getLastSunday;
    vm.clearStartDate = clearStartDate;
    vm.clearEndDate = clearEndDate;
    vm.clearKeywords = clearKeywords;
    vm.addPopularTag = addPopularTag;
    vm.setTags = setTags;
    vm.startLoader = startLoader;
    vm.stopLoader = stopLoader;

    vm.getVoteDirection = getVoteDirection;
    vm.savedByUser = savedByUser;
    vm.reportedByUser = reportedByUser;

    vm.searchDateStart = vm.getLastSunday(moment().local().startOf('month'));
    vm.searchDateEnd = vm.getLastSunday(moment().local().startOf('month')).add(6, 'weeks');

    vm.loadingBlurStyle = {
      opacity: 1
    };

    _activate();

    ////////////////////////////////

    function _activate() {
      var votedEvents = EventFacadeService.getVotedEvents(),
        savedEvents = EventFacadeService.getSavedEvents(),
        reportedEvents = EventFacadeService.getReportedEvents(),
        i;
      for (i = 0; i < votedEvents.length; i += 1) {
        vm.votedEventDirection[votedEvents[i].event.id] = votedEvents[i].direction;
      }

      for (i = 0; i < savedEvents.length; i += 1) {
        vm.savedEvents[savedEvents[i].id] = true;
      }

      for (i = 0; i < reportedEvents.length; i += 1) {
        vm.reportedEvents[reportedEvents[i].event] = reportedEvents[i].reason;
      }

      EventFacadeService.getPopularTags().
        success(function (data, status, headers, config) {
          vm.popularTags = data;
        }).
        error(function (data, status, headers, config) {
          // Do something
        });

      // multiple pubsubs that are all used by event factory
      PubSubService.subscribe(settings.pubSubOnSetTagsLeftPanel, vm.setTags);
      PubSubService.subscribe(settings.pubSubOnStartLoader, vm.startLoader);
      PubSubService.subscribe(settings.pubSubOnStopLoader, vm.stopLoader);
    }

    /**
     * @description starts the loading icon (subscribed to event factory)
     * @methodOf chronosApp:LeftPanelController
     */
    function startLoader() {
      vm.loading = true;
      vm.loadingBlurStyle = {
        opacity: 0.4
      };
    }

    /**
     * @description stops the loading icon (subscribed to event factory)
     * @methodOf chronosApp:LeftPanelController
     */
    function stopLoader() {
      vm.loading = false;
      vm.loadingBlurStyle = {
        opacity: 1
      };
    }

    /**
     * @description Returns the date of a Sunday used for the initial dates shown
     * @methodOf chronosApp:LeftPanelController
     * @returns the moment for the sunday before the date provided
     */
    function getLastSunday(providedDate) {
      if (providedDate.isoWeekday() === 7) {
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
          NotificationService.errorMessage(vm.searchError);
          return;
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
        EventFacadeService.updateEvents(filterParams);
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
      if (vm.searchKeywords) {
        vm.searchError = '';
        var tempKeywords = vm.searchKeywords.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");

        if (tempKeywords.length > settings.maxKeywords) {
          vm.searchError = "Max of 10 keywords.";
          NotificationService.errorMessage(vm.searchError);
          return;
        } else {
          EventFacadeService.updateKeywords(tempKeywords);
        }
      } else {
        vm.searchEvents();
      }
    }

    /**
     * @description Updates the start date and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateStartDate() {
      if (vm.searchDateStart) {
        var fromDate = moment(vm.searchDateStart).utc();
        EventFacadeService.updateDateRangeStart(fromDate);
      } else {
        vm.searchEvents();
      }
    }

    /**
     * @description Updates the end date and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateEndDate() {
      if (vm.searchDateEnd) {
        var toDate = moment(vm.searchDateEnd).utc();
        EventFacadeService.updateDateRangeEnd(toDate);
      } else {
        vm.searchEvents();
      }
    }

    /**
     * @description Adds a selected popular tag to the tag bar
     * @methodOf chronosApp:LeftPanelController
     */
    function addPopularTag(tag) {
      vm.searchError = '';
      var noMatch = true;
      var tempTags = [];

      delete tag['usage'];
      delete tag['$$hashKey'];

      vm.addedTags.forEach(function (tag2) {
        if (tag2.name == tag.name){
          noMatch = false;
        }
      });

      if (noMatch) {
        vm.addedTags.push(tag);
      } else {
        vm.searchError = "Identical Tag Found.";
        NotificationService.errorMessage(vm.searchError);
        return;
      }

      updateTags();
    }

    /**
     * @description Updates the tags and updates the events
     * @methodOf chronosApp:LeftPanelController
     */
    function updateTags() {
      vm.searchError = '';
      vm.storageTags = [];
      var tempTags = [];

      if (vm.addedTags.length > settings.maxNumberTags) {
        vm.addedTags.splice(-1, 1);
        vm.searchError = "Max of 5 tags.";
        NotificationService.errorMessage(vm.searchError);
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
          vm.searchError = "Identical Tag Found.";
          NotificationService.errorMessage(vm.searchError);
          return;
        }
      });

      EventFacadeService.updateTags(vm.storageTags);
    }

    /**
     * @description Allows tags to be set when it is changed in evevntfactory
     * @methodOf chronosApp:LeftPanelController
     */
    function setTags() {
      var tempTagsEventFactory = EventFacadeService.getTags();
      var tempTags = [];
      var tempTagObject = {};

      tempTagsEventFactory.forEach(function (tag) {
        tempTagObject = {};
        tempTagObject.name = tag;
        tempTags.push(tempTagObject);
      });

      vm.addedTags = tempTags;
    }

    /**
     * @description Calculates the direction (one of +1, 0, and -1} that the user previously voted on the event
     * @methodOf chronosApp:LeftPanelController
     * @param event Event to check
     * @returns {Number} direction +1 if user upvoted it, -1 if user downvoted it, and 0 for neither.
     */
    function getVoteDirection(chosenEvent) {
      if (vm.votedEventDirection[chosenEvent.id] !== undefined) {
        return vm.votedEventDirection[chosenEvent.id];
      }
      return 0;
    }

    /**
     * @description Checks whether a given event was previously reported by the user
     * @methodOf chronosApp:LeftPanelController
     * @param event Event to check
     * @returns {Boolean} True if user previously reported the event
     */
    function reportedByUser(chosenEvent) {
      return vm.reportedEvents[chosenEvent.id] !== undefined;
    }

    /**
     * @description Checks whether a given event was previously saved by the user
     * @methodOf chronosApp:LeftPanelController
     * @param event Event to check
     * @returns {Boolean} True if user previously saved the event
     */
    function savedByUser(chosenEvent) {
      return vm.savedEvents[chosenEvent.id] !== undefined;
    }
  }
})();
