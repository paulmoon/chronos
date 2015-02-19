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

//StateService.$inject = [''];

/* @ngInject */
function StateService() {
	var _placeIDSearch;
	var _dateRangeStartSearch;
	var _dateRangeEndSearch;
	var _tagsSearch;
	var _keywordsSearch;

	this.hello = function () {
	return "Hello";
	};

	this.goodbye = function () {
	return "Goodbye";
	};

	/**
     * Place ID Search set/get
     */
	this.setPlaceID = function(_placeID) {
		_placeIDSearch = _placeID;
	};

	this.getPlaceID = function() {
		return _placeIDSearch;
	};

	/**
     * Date Range Start Search set/get
     */
	this.setDateRangeStart = function(_dateRangeStart) {
		_dateRangeStartSearch = _dateRangeStart;
	};

	this.getDateRangeStart = function() {
		return _dateRangeStartSearch;
	};

	/**
     * Date Range End Search set/get
     */
	this.setDateRangeEnd = function(_dateRangeEnd) {
		_dateRangeEndSearch = _dateRangeEnd;
	};

	this.getDateRangeEnd = function() {
		return _dateRangeEndSearch;
	};

	/**
     * Tags Search set/get
     */
	this.setTags = function(_tags) {
		_tagsSearch = _tags;
	};

	this.getTags = function() {
		return _tagsSearch;
	};

	/**
     * Keywords Search set/get
     */
	this.setKeywords = function(_keywords) {
		_keywordsSearch = _keywords;
	};

	this.getKeywords = function() {
		return _keywordsSearch;
	};
}
