(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('NotificationService', NotificationService);

  NotificationService.$inject = [];

  function NotificationService() {
  
  	this.errorMessage = function(message) {
  		$.growl.error({message: message});
  	}

  	this.noticeMessage = function(message) {
  		$.growl.notice({message: message});
  	}

  	this.warningMessage = function(message) {
  		$.growl.warning({message: message});
  	}
  }
})();