/*global describe:true, it:true, beforeEach:true, afterEach:true, expect:true, spyOn:true, module:true, inject:true, angular:true, jasmine:true */
describe('controllers', function () {
    'use strict';
    var $controller, $rootScope;

    beforeEach(module('allure.controllers'));
    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    describe('GraphCtrl', function() {
        function createController(testcases) {
            var scope = $rootScope.$new();
            scope = scope.$new();
            $controller('GraphCtrl', {
                $scope: scope,
                testcases: {testCases: testcases},
                status: {
                    all: ['FAILED', 'BROKEN', 'CANCELED', 'PASSED', 'PENDING']
                }
            });
            return scope;
        }

        it('should detect that all tests passed', function() {
            var scope = createController([{status: 'PASSED'}, {status: 'PASSED'}, {status: 'PASSED'}]);
            expect(scope.testsPassed).toBe(true);
        });

        it('should detect that some tests failed', function() {
            var scope = createController([{status: 'FAILED'}, {status: 'PASSED'}, {status: 'PASSED'}]);
            expect(scope.testsPassed).toBe(false);
        });

        it('should format pie-chart data', function() {
            var scope = createController([{status: 'FAILED'}, {status: 'PASSED'}, {status: 'PASSED'}]);
            expect(scope.statistic).toEqual({
                passed: 2, canceled: 0, failed: 1, broken: 0, pending: 0,
                total: 3
            });
            expect(scope.chartData).toEqual([
                {name: 'failed', value: 1, part: 1/3},
                {name: 'broken', value: 0, part: 0},
                {name: 'canceled', value: 0, part: 0},
                {name: 'passed', value: 2, part: 2/3},
                {name: 'pending', value: 0, part: 0}
            ]);
        });
    });

    describe('TimelineCtrl', function() {
        function createController() {
            var scope = $rootScope.$new();
            scope = scope.$new();
            $controller('TimelineCtrl', {
                $scope: scope,
                $state: {},
                data: {"hosts": [{
                    threads: [{
                        testCases: [
                            {time: {start: 10, stop: 12}},
                            {time: {start: 15, stop: 16}}
                        ]
                    }, {
                        testCases: [
                            {time: {start: 42, stop: 50}}
                        ]
                    }]
                }, {
                    threads: [{
                        testCases: [
                            {time: {start: 11, stop: 48}}
                        ]
                    }]
                }]}
            });
            return scope;
        }

        it("should find minimal start time", function () {
            var scope = createController();
            expect(scope.startTime).toBe(10);
            expect(scope.timeRange).toEqual([0,40]);
        });
    });



    describe('NavbarCtrl', function() {
        var $translate, $storage;
        function createController() {
            var scope = $rootScope.$new();
            scope = scope.$new();
            $controller('NavbarCtrl', {
                $scope: scope,
                $translate: $translate = jasmine.createSpyObj('$translate', ['use']),
                $storage: function() {
                    return $storage;
                },
                $window: {
                    navigator: {
                        language: 'en-US'
                    }
                }
            });
            return scope;
        }

        beforeEach(function() {
            $storage = jasmine.createSpyObj('$storage', ['getItem', 'setItem']);
        });

        it('should load report info', inject(function($httpBackend) {
            $httpBackend.expectGET('data/report.json').respond({size: 123});
            var scope = createController();
            $httpBackend.flush();
            expect(scope.report).toEqual({size: 123});
        }));

        it("should get locale from storage", function() {
            $storage.getItem.andReturn('ru');
            var scope = createController();
            expect(scope.selectedLang).toBe('ru');
        });

        it("should set english by default", function() {
            var scope = createController();
            expect(scope.selectedLang).toBe('en');
        });
    });
});
