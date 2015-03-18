/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp:EventFacadeService
 * @description EventFacadeService that facilitates communication between various factories and services.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('EventFacadeService', EventFacadeService);

  EventFacadeService.$inject = ['RestService', 'CommentFactory', 'EventFactory', 'StateService', 'PubSubService', 'settings'];

  function EventFacadeService(RestService, CommentFactory, EventFactory, StateService, PubSubService, settings) {
    var self = this;

    this.createEvent = function (eventName, description, picture, startTime, endTime, locationID, locationName, tags) {
      return RestService.createEvent(eventName, description, picture, startTime, endTime, locationID, locationName, tags)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventCreate);
          return response;
        });
    };

    this.updateEvent = function (eventName, description, picture, startTime, endTime, tags) {
      return RestService.updateEvent(eventName, description, picture, startTime, endTime, tags)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.getEvent = function (eventID) {
      return RestService.getEvent(eventID);
    };

    this.voteEvent = function (eventID, direction) {
      return RestService.voteEvent(eventID, direction);
    };

    this.saveEvent = function (eventID) {
      return RestService.saveEvent(eventID);
    };

    this.getSelectedEvents = function () {
      return EventFactory.selectedEvents;
    };

    this.updateEvents = function (filterParams) {
      return EventFactory.updateEvents(filterParams);
    };

    this.updateDateRangeStart = function (start) {
      return EventFactory.updateDateRangeStart(start);
    };

    this.updateDateRangeEnd = function (end) {
      return EventFactory.updateDateRangeEnd(end);
    };

    this.updateSelectionRange = function (start, end) {
      return EventFactory.updateSelectionRange(start, end);
    };

    this.updateKeywords = function (keywords) {
      return EventFactory.updateKeywords(keywords);
    };

    this.updateTags = function (tags) {
      return EventFactory.updateTags(tags);
    };

    this.refreshEvents = function () {
      return EventFactory.refreshEvents();
    };

    this.clearSelectedEvents = function () {
      EventFactory.selectedEventsStartRange = null;
      EventFactory.selectedEventsEndRange = null;
      EventFactory.selectedEvents = EventFactory.getEvents();
    };

    this.getComment = function (eventID) {
      return CommentFactory.getComment(eventID);
    };

    this.saveComment = function (eventID, commentText) {
      return CommentFactory.saveComment(eventID, commentText);
    };
  }
})();
