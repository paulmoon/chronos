'use strict';

describe('Controller: EventpagecontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('chronosApp'));

  var EventpagecontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventpagecontrollerCtrl = $controller('EventpagecontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
