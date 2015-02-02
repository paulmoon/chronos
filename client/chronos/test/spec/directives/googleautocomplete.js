'use strict';

describe('Directive: googleautocomplete', function () {

  // load the directive's module
  beforeEach(module('chronosApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<googleautocomplete></googleautocomplete>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the googleautocomplete directive');
  }));
});
