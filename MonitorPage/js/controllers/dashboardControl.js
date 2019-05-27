angular.module('app')
    .controller('dashboardControl', ['$scope', '$window', '$mdDialog', 'dashboardService', 'pageStates', 'widgetsInfo', '$timeout', 
        function ($scope, $window, $mdDialog, dashboardService, pageStates, widgetsInfo, $timeout) {

        $scope.fetching = true;
        $scope.editTitle = false;
        $scope.modifyingTemplate = false;
        $scope.currentState = pageStates.PREVIEW;
        $scope.pageStates = pageStates;
        $scope.userDashboard = [];
        $scope.temporaryDashboard = null;
        $scope.nrWidgetsDisplayed = 2 * widgetsInfo.DISPLAYED_WIDGETS_NUMBER;
        $scope.widgetSize = widgetsInfo.SIZE;

        var grid = null;
        var removingHeightdifferences = function () {
            $timeout(function () {
                grid = new Muuri('.grid', {
                    items: '.draggable-item',
                    dragEnabled: true,
                    dragStartPredicate: {
                        handle: '.drag-handle'
                    },
                    layout: {
                        fillGaps: true,
                    }
                });

            }, 1000);
        };

        var gotDefaultDashboardWidgets = function (widgets) {
            $scope.widgetsDialog = widgets;
        };

        var getInitialInfo = function () {
            dashboardService.getUserDashboard(gotUserDashboard);
        };

        var gotUserDashboard = function (template) {
            $scope.userDashboard = template;
            console.log('template ', template);
            
            $scope.fetching = false;
            dashboardService.getDefaultDashboardWidgets(gotDefaultDashboardWidgets);
        };

        $scope.getMoreWidgets = function () {
            $scope.nrWidgetsDisplayed += widgetsInfo.DISPLAYED_WIDGETS_NUMBER;
        };

        $scope.addWidget = function (widget) {
            if (!$scope.temporaryDashboard.widgets) {
                $scope.temporaryDashboard.widgets = [];
            }
            $scope.temporaryDashboard.widgets.push(angular.fromJson(angular.toJson(widget)));
            removingHeightdifferences()
        };

        $scope.deleteWidget = function (widgetIndex) {
            $scope.temporaryDashboard.widgets.splice(widgetIndex, 1);
            removingHeightdifferences();
        };

        $scope.changeStates = function () {
            $scope.nrWidgetsDisplayed = 2 + widgetsInfo.DISPLAYED_WIDGETS_NUMBER;
            $scope.editTitle = false;
            if ($scope.currentState === pageStates.PREVIEW) {
                $scope.temporaryDashboard = angular.fromJson(angular.toJson($scope.userDashboard));
                $scope.currentState = pageStates.EDITING;
                widgetsLoaded = 0;
                allWidgetsLoaded = false;
            }
            else {
                if ($scope.modifyingTemplate === false) {
                    $scope.modifyingTemplate = true;

                    function checkItemsPosition(items) {
                        let itemsOrdered = [];
                        for(let i = 0; i < items.length; i++) {
                            let name = $(items[i]._element).data('name');
                            let item = getWidgetByName(name, $scope.temporaryDashboard.widgets);
                            if(item) {
                                itemsOrdered.push(item);
                            }
                        }

                        $scope.temporaryDashboard.widgets = itemsOrdered;
                    }

                    function getWidgetByName(name, widgets) {
                        for(let index in widgets) {
                            if(widgets[index].name === name) return widgets[index];
                        }

                        return null;
                    }

                    if(grid) {
                        checkItemsPosition(grid.getItems());
                    }

                    dashboardService.saveDashboard($scope.temporaryDashboard, refreshDashboard);
                    $scope.currentState = pageStates.PREVIEW;
                    $scope.temporaryDashboard = null;
                    widgetsLoaded = 0;
                    allWidgetsLoaded = false;
                }
            } 
        };

        var refreshDashboard = function (template) {
            $scope.userDashboard = null;
            $scope.modifyingTemplate = false;
            setTimeout(function () {
                $scope.userDashboard = template;
                $scope.$apply();
            }, 1000)
        };

        $scope.revertChanges = function () {
            $scope.nrWidgetsDisplayed = 2 * widgetsInfo.DISPLAYED_WIDGETS_NUMBER;
            $scope.currentState = pageStates.PREVIEW;
            $scope.temporaryDashboard = null;
        };

        $scope.cancelEditingTitle = function () {
            $scope.temporaryDashboard.title = $scope.userDashboard.title;
            $scope.editTitle = false;
        };

        $scope.restoreDefault = function () {
            dashboardService.restoreDefaultDashboard($scope.defaultRestored);
        };

        $scope.defaultRestored = function (template) {
            $scope.temporaryDashboard = template;
            setTimeout(function () {
                $scope.$apply()
            }, 1000)
        };

        $scope.openWidgetDialog = function (event) {
            $mdDialog.show({
                locals: {widgetsList: $scope.widgetsDialog},
                controller: "dialogController",
                templateUrl: 'tpl/parts/dialogWidgets.html',
                parent: angular.element(document.body),
                targetEvent: event,
                disableParentScroll: false,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                $scope.addWidget(answer);
            })
        };

        angular.element($window).bind('resize', function () {
            removingHeightdifferences()
        });

        $scope.$on('reload-widget', function () {
            removingHeightdifferences()
        });

        getInitialInfo();
    }])
    .controller("dialogController", ['$scope', '$mdDialog', 'widgetsList', function ($scope, $mdDialog, widgetsList) {

        $scope.radioValue = null;
        $scope.list = widgetsList;
        $scope.limitWidgetsDisplayed = 3;
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

    }]);
