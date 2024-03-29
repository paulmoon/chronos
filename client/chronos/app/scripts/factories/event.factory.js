/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.EventFactory
 * @description Factory used for retrieving (filtered) events from a single place.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .factory('EventFactory', EventFactory);

  EventFactory.$inject = ['$log', '$q', 'RestService', 'StateService', 'settings', 'NotificationService', 'PubSubService'];

  /* @ngInject */
  function EventFactory($log, $q, RestService, StateService, settings, NotificationService, PubSubService) {
    var factory = {
      events: [],
      selectedEvents: [],
      savedEvents: [],
      reportedEvents: [],
      votedEvents: [],
      keywords: [],
      tags: [],
      selectedEventsStartRange: undefined,
      selectedEventsEndRange: undefined,
      dateRangeStart: undefined,
      dateRangeEnd: undefined,

      getEvents: getEvents,
      getSelectedEvents: getSelectedEvents,
      getSavedEvents: getSavedEvents,
      setSavedEvents: setSavedEvents,
      getReportedEvents: getReportedEvents,
      setReportedEvents: setReportedEvents,
      getVotedEvents: getVotedEvents,
      setVotedEvents: setVotedEvents,
      getTags: getTags,

      updateKeywords: updateKeywords,
      updateTags: updateTags,
      addTag: addTag,
      updateDateRange: updateDateRange,
      updateDateRangeStart: updateDateRangeStart,
      updateDateRangeEnd: updateDateRangeEnd,
      updateSelectionRange: updateSelectionRange,
      updateEvents: updateEvents,
      refreshEvents: refreshEvents,
    };

    return factory;

    //////////////////////

    /**
     * @description Returns the events that the factory holds.
     * @methodOf chronosApp:EventFactory
     * @returns List of events in the EventFactory.
     */
    function getEvents() {
      return factory.events;
    }

    /**
     * @description Returns the tags that the event factory holds
     * @methodOf chronosApp:EventFactory
     * @returns the current set of tags
     */
    function getTags() {
      return factory.tags;
    }

    /**
     * @description Returns the events that the application is currently displaying.
     * @methodOf chronosApp:EventFactory
     * @returns List of events that the application is currently showing.
     */
    function getSelectedEvents() {
      return factory.selectedEvents;
    }

    /**
     * @description Get all events that user saved.
     * @methodOf chronosApp:EventFactory
     * @returns savedEvents Saved events
     */
    function getSavedEvents() {
      return factory.savedEvents;
    }

    /**
     * @description Set all events that user saved.
     * @methodOf chronosApp:EventFactory
     * @param savedEvents Saved events
     */
    function setSavedEvents(savedEvents) {
      factory.savedEvents = savedEvents;
    }

    /**
     * @description Get all events that user saved.
     * @methodOf chronosApp:EventFactory
     * @returns savedEvents Saved events
     */
    function getReportedEvents() {
      return factory.reportedEvents;
    }

    /**
     * @description Set all events that user saved.
     * @methodOf chronosApp:EventFactory
     * @param savedEvents Saved events
     */
    function setReportedEvents(reportedEvents) {
      factory.reportedEvents = reportedEvents;
    }

    /**
     * @description Get all events that user has voted on.
     * @methodOf chronosApp:EventFactory
     * @returns getVotedEvents Voted events
     */
    function getVotedEvents() {
      return factory.votedEvents;
    }

    /**
     * @description Set all events that user has voted on.
     * @methodOf chronosApp:EventFactory
     * @param votedEvents
     */
    function setVotedEvents(votedEvents) {
      factory.votedEvents = votedEvents;
    }

    /**
     * @description Allows the user to update the events when a location has changed
     * @methodOf chronosApp:EventFactory
     */
    function refreshEvents() {
      return _updateEvents();
    }

    /**
     * @description add a single tag and update events
     * @methodOf chronosApp:EventFactory
     * @param tag a single new tag to add
     * @returns {*}
     */
    function addTag(tag) {
      var match = false;

      if (factory.tags.length >= settings.maxNumberTags) {
        NotificationService.errorMessage("Max of 5 tags.");
        return;
      }

      factory.tags.forEach(function (tag2) {
        if (tag === tag2) {
          match = true;
        }
      });

      if (match) {
        NotificationService.errorMessage("Identical tag found.");
        return;
      }

      factory.tags.push(tag);
      PubSubService.publish(settings.pubSubOnSetTagsLeftPanel);
      return _updateEvents();
    }

    /**
     * @description Update events with given keywords
     * @methodOf chronosApp:EventFactory
     * @param keywords Array of keywords by which keywords will be filtered
     * @returns {*}
     */
    function updateKeywords(keywords) {
      factory.keywords = keywords;
      return _updateEvents();
    }

    /**
     * @description Update events with given tags
     * @methodOf chronosApp:EventFactory
     * @param tags Array of tags by which events will be filtered
     * @returns {*}
     */
    function updateTags(tags) {
      factory.tags = tags;
      return _updateEvents();
    }

    /**
     * Update the events using the specified date range start.
     * @param start Moment type
     * @returns {Promise}
     */
    function updateDateRangeStart(start) {
      factory.dateRangeStart = start;
      return _updateEvents();
    }

    /**
     * Update the events using the specified date range end.
     * @param start Moment type
     * @returns {Promise}
     */
    function updateDateRangeEnd(end) {
      factory.dateRangeEnd = end;
      return _updateEvents();
    }

    /**
     * @description Update events with the given date range
     * @methodOf chronosApp:EventFactory
     * @param start Moment type
     * @param end Moment type
     * @returns {*} List of events filtered with new date range.
     */
    function updateDateRange(start, end) {
      factory.dateRangeStart = start;
      factory.dateRangeEnd = end;
      return _updateEvents();
    }

    /**
     * @description Sets the start and end range for which to display the events. If June 15th selected,
     * then the start time will be June 15th 12:00:00 AM (UTC) and the end time will be June 16th
     * 12:00:00 AM (UTC).
     * @methodOf chronosApp:EventFactory
     * @param start Moment type
     * @param end Moment type
     */
    function updateSelectionRange(start, end) {
      var deferred = $q.defer();

      factory.selectedEventsStartRange = start;
      factory.selectedEventsEndRange = end;
      // The only time we don't display any events is if eventStart > end or eventEnd < start.
      // Converse by De Morgan's Law: If eventStart <= end and eventEnd >= start
      factory.selectedEvents = factory.events.filter(function (element) {

        // If the start and end date are the same, then we are only selecting one day. Then, we filter
        // based on start_date to start_date + 23:59:59
        // Note we will never enter this via Full Calendar because selecting one day always
        // ensures we are checking against the next day
        if (element.start_date.diff(element.end_date) === 0) {
          return element.start_date < start.local().add(1, 'd') && element.end_date >= start.local();
        }


        // This is in case the start and end dates are an actual selection
        // An event ending at 12AM June 15th should not be shown when we select on June 15th. Similarly, an event
        // beginning on June 15th 12AM should not be shown when we click on June 14th (clicked date's end =
        // June 15th 12AM). Since we don't want to show the event because they are on different days,
        // strict inequality is used.

        var startAfterStart = element.start_date.isAfter(start);
        var startAfterStartOrSame = startAfterStart || element.start_date.isSame(start);
        var endBeforeEnd = element.end_date.isBefore(end);
        var endBeforeEndOrSame = endBeforeEnd || element.end_date.isSame(end);

        // The check goes as follows: (It can probably be simplified I know)
        // 1. Is the start date after or the same as the start of the date range filter AND is the start date before the end of the date range filter OR (start of event is in the date range)
        // 2. Is the end date after the start of the date range filter AND is the end date before or the same as the end of the date range filter OR (end of event is in the date range)
        // 3. Is the start date after or the same as the date range filter AND is the end date before or the same as the end of the date range filter (event exists in between the start and end of date range)
        return (startAfterStartOrSame && element.start_date.isBefore(end)) ||
          (element.end_date.isAfter(start) && endBeforeEndOrSame) ||
          (startAfterStartOrSame && endBeforeEndOrSame);
      });

      deferred.resolve("Selected a range");
      return deferred.promise;
    }

    /**
     * @description Batch update the events. New keywords, tags, fromDate and toDate, and other keys in filterParams
     * are used to filter the events. This expects dateRangeStart and dateRangeEnd to be Moment objects. If a
     * filterParams is not specified it is set to nothing. This function should only be used by the "apply filters"
     * button.
     * @methodOf chronosApp:EventFactory
     * @param filterParams Object of {key: value} filter parameters.
     */
    function updateEvents(filterParams) {
      if (filterParams.keywords) {
        factory.keywords = filterParams.keywords;
      } else {
        factory.keywords = [];
      }

      if (filterParams.fromDate) {
        factory.dateRangeStart = filterParams.fromDate;
      } else {
        factory.dateRangeStart = undefined;
      }

      if (filterParams.toDate) {
        factory.dateRangeEnd = filterParams.toDate;
      } else {
        factory.dateRangeEnd = undefined;
      }

      return _updateEvents();
    }

    /**
     * @description Internal method for updating EventFactory.events.
     * @methodOf chronosApp:EventFactory
     * @returns Promise containing list of events if succeeded or rejected promise otherwise.
     * @private
     */
    function _updateEvents() {
      PubSubService.publish(settings.pubSubOnStartLoader);
      var filterParams = _constructFilterParams();

      return RestService.getFilteredEvents(filterParams)
        .then(function (response) {
          var newEvents = response.data;

          for (var i = 0; i < newEvents.length; i++) {
            // Note that here, we're ensuring all event dates are a moment type in UTC format. This is extremely important
            newEvents[i].start_date = moment.utc(newEvents[i].start_date);
            newEvents[i].end_date = moment.utc(newEvents[i].end_date);
          }

          factory.events = newEvents;
          PubSubService.publish(settings.pubSubOnStopLoader);

          if (factory.selectedEventsStartRange !== undefined && factory.selectedEventsEndRange !== undefined) {
            updateSelectionRange(factory.selectedEventsStartRange, factory.selectedEventsEndRange);
          } else {
            factory.selectedEvents = newEvents;
          }

          return factory.events;
        }, function (response) {
          $log.warn('Failed to retrieve filtered events: ' + filterParams);
          $log.warn(response);
          PubSubService.publish(settings.pubSubOnStopLoader);
          return $q.reject(response);
        });
    }

    /**
     * Helper method for constructing {key: value} filter parameter object
     * @methodOf chronosApp:EventFactory
     * @returns {{}} filterParam object
     * @private
     */
    function _constructFilterParams() {
      var filterParams = [];

      if (factory.keywords.length > 0) {
        factory.keywords.forEach(function (keyword) {
          filterParams.push({name: "keyword", value: keyword});
        });
      }

      if (factory.tags.length > 0) {
        factory.tags.forEach(function (tag) {
          filterParams.push({name: "tag", value: tag});
        });
      }

      // Provide YYYY-MM-DDTHH:mm:ss for Django.
      if (factory.dateRangeStart) {
        filterParams.push({name: "fromDate", value: factory.dateRangeStart.utc().format('YYYY-MM-DD[T]HH:mm:ss')});
      }

      if (factory.dateRangeEnd) {
        filterParams.push({name: "toDate", value: factory.dateRangeEnd.utc().format('YYYY-MM-DD[T]HH:mm:ss')});
      }

      if (StateService.getPlaceID()) {
        filterParams.push({name: "placeID", value: StateService.getPlaceID()});
      }

      return filterParams;
    }
  }
})();
