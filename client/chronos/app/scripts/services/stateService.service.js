'use strict';

/**
 * @author Justin Guze
 * @ngdoc service
 * @name chronosApp.stateService
 * @description
 * # stateService
 * Service in the chronosApp.
 */

angular
  .module('chronosApp')
  .service('StateService', StateService);

function StateService() {
	var _placeIDSearch;
	var _dateRangeStartSearch;
	var _dateRangeEndSearch;
	var _tagsSearch;
	var _keywordsSearch;
	var _placeNameHolder;

	/**
     * Place ID Search set/get
     */
	this.setPlaceID = function(placeID) {
		_placeIDSearch = placeID;
	};

	this.getPlaceID = function() {
		return _placeIDSearch;
	};

	/**
     * Date Range Start Search set/get
     */
	this.setDateRangeStart = function(dateRangeStart) {
		_dateRangeStartSearch = dateRangeStart;
	};

	this.getDateRangeStart = function() {
		return _dateRangeStartSearch;
	};

	/**
     * Date Range End Search set/get
     */
	this.setDateRangeEnd = function(dateRangeEnd) {
		_dateRangeEndSearch = dateRangeEnd;
	};

	this.getDateRangeEnd = function() {
		return _dateRangeEndSearch;
	};

	/**
     * Tags Search set/get
     */
	this.setTags = function(tags) {
		_tagsSearch = tags;
	};

	this.getTags = function() {
		return _tagsSearch;
	};

	/**
     * Keywords Search set/get
     */
	this.setKeywords = function(keywords) {
		_keywordsSearch = keywords;
	};

	this.getKeywords = function() {
		return _keywordsSearch;
	};
}
