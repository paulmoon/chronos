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
          PubSubService.publish(settings.pubSubOnEventEdit);
          return response;
        });
    };

    this.getEvent = function (eventID) {
      return RestService.getEvent(eventID);
    };

    this.getSavedEvents = function () {
      return EventFactory.getSavedEvents();
    };

    this.getVotedEvents = function () {
      return EventFactory.getVotedEvents();
    };

    this.getReportedEvents = function () {
      return EventFactory.getReportedEvents();
    };

    this.getSelectedEvents = function () {
      return EventFactory.getSelectedEvents();
    };

    this.voteEvent = function (eventID, direction) {
      return RestService.voteEvent(eventID, direction)
        .then(function (response) {
          var votedEvents = EventFactory.getVotedEvents();
          votedEvents.push({eventID: direction});
          EventFactory.setVotedEvents(votedEvents);
          return response;
        });
    };

    this.reportEvent = function (eventID, reason) {
      return RestService.reportEvent(eventID, reason)
        .then(function (response) {
          var reportedEvents = EventFactory.getReportedEvents();
          reportedEvents.push({eventID: reason});
          EventFactory.setReportedEvents(reportedEvents);
          return response;
        });
    };

    this.saveEvent = function (eventID) {
      return RestService.saveEvent(eventID)
        .then(function (response) {
          var savedEvents = EventFactory.getSavedEvents();
          savedEvents.push(eventID);
          EventFactory.setSavedEvents(savedEvents);
          return response;
        });
    };

    this.unsaveEvent = function(eventID) {
      return RestService.unsaveEvent(eventID)
      .then(function(response) {
        var savedEvents = EventFactory.getSavedEvents();
        savedEvents.pop(eventID);
        EventFactory.setSavedEvents(savedEvents);
        return response;
      });
    }

    this.updateEvents = function (filterParams) {
      return EventFactory.updateEvents(filterParams)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.updateDateRangeStart = function (start) {
      return EventFactory.updateDateRangeStart(start)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.updateDateRangeEnd = function (end) {
      return EventFactory.updateDateRangeEnd(end)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.updateSelectionRange = function (start, end) {
      return EventFactory.updateSelectionRange(start, end)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.updateKeywords = function (keywords) {
      return EventFactory.updateKeywords(keywords)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.updateTags = function (tags) {
      return EventFactory.updateTags(tags)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
    };

    this.refreshEvents = function () {
      return EventFactory.refreshEvents()
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnEventUpdate);
          return response;
        });
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
      return CommentFactory.saveComment(eventID, commentText)
        .then(function (response) {
          PubSubService.publish(settings.pubSubOnCommentCreate);
          return response;
        });
    };

    this.addTag = function (tag) {
      return EventFactory.addTag(tag);
    };

    this.getTags = function () {
      return EventFactory.getTags();
    };

    this.uploadImage = function (image) {
      return RestService.uploadImage(image);
    };
  }
})();
