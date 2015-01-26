'use strict';

describe('Controller: LeftpanelcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('chronosApp'));

  var LeftpanelcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeftpanelcontrollerCtrl = $controller('LeftpanelcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
