/**
 * @author Dorneanu Dragos-Andrei(dragos.a.dorneanu@gmail.com) on 8/3/17
 */
angular.module('app')
    .controller('logsController', ['$scope', '$window', '$mdSidenav', '$mdExpansionPanel', 'logsService', 'logsPageConstants', 'moment', 'swarmEsbEntitiesService',
        function ($scope, $window, $mdSidenav, $mdExpansionPanel, logsService, logsPageConstants, moment, swarmEsbEntitiesService) {
            'use strict';

            $scope.logs = [];
            $scope.logsPagesCount = 0;
            $scope.currentPagesSet = 1;
            $scope.PAGES_SET_SIZE = logsPageConstants.PAGES_SET_SIZE;
            $scope.maxPagesSet = 0;
            $scope.fetchingPage = true;
            $scope.fetchingLogs = true;
            $scope.PAGE_SIZE = logsPageConstants.PAGE_SIZE;
            $scope.logTypes = [];
            $scope.tableColumns = [];
            $scope.formattedDate = true;
            $scope.timestampStartValue = moment(0).toDate();
            $scope.timestampEndValue = moment().toDate();
            $scope.allLogTypesChecked = true;
            $scope.allTableColumnsRendered = true;
            $scope.MAX_INFO_SIZE = logsPageConstants.MAX_INFO_SIZE;
            $scope.ASCENDING_ORDER = "asc";
            $scope.DESCENDING_ORDER = "desc";
            $scope.patternToMatch = '';
            $scope.editingMobileSettings = false;
            $scope.mobileWantedLogTypes = JSON.parse(localStorage.defaultMobileWantedLogTypes || '[]');
            $scope.mobileRenderedTableColumns = JSON.parse(localStorage.defaultMobileRenderedTableColumns || '[]');
            $scope.wantedLogTypes = [];
            $scope.renderedTableColumns = [];
            $scope.swarmList = [];
            $scope.mobileSettingsError = false;
            $scope.monitoredSwarm = '';

            $scope.logsFilter = {
                availableFilters: {
                    timestampStartValue: moment($scope.timestampStartValue).valueOf(),
                    timestampEndValue: moment($scope.timestampEndValue).valueOf(),
                    types: $scope.wantedLogTypes,
                    renderedColumns: $scope.renderedTableColumns,
                    patternToMatch: '',
                    monitoredSwarm: '',
                    orderBy: 'Timestamp',
                    orderType: 'desc',
                },
                logsPage: 1,
                pageSize: $scope.PAGE_SIZE
            };
            let expandedInfoPanelsId = [];

            $scope.$watch('wantedLogTypes', function () {
                $scope.allLogTypesChecked = ($scope.wantedLogTypes.length === $scope.logTypes.length);
                $scope.logsFilter.availableFilters.types = $scope.wantedLogTypes;
            }, true);

            $scope.$watch('renderedTableColumns', function () {
                $scope.allTableColumnsRendered = ($scope.renderedTableColumns.length === $scope.tableColumns.length);
                $scope.logsFilter.availableFilters.renderedColumns = $scope.renderedTableColumns;
            }, true);

            $scope.$watch('timestampStartValue', function () {
                $scope.logsFilter.availableFilters.timestampStartValue = moment($scope.timestampStartValue).valueOf();
            }, true);

            $scope.$watch('timestampEndValue', function () {
                $scope.logsFilter.availableFilters.timestampEndValue = moment($scope.timestampEndValue).valueOf();
            });

            $scope.$watch('PAGE_SIZE', function () {
                if ($scope.PAGE_SIZE) {
                    $scope.logsFilter.pageSize = $scope.PAGE_SIZE;
                }
            }, true);

            $scope.$watch('mobileWantedLogTypes', function () {
                $scope.allLogTypesCheckedOnMobile = ($scope.mobileWantedLogTypes.length === $scope.logTypes.length);
            }, true);

            $scope.$watch('mobileRenderedTableColumns', function () {
                $scope.allTableColumnsRenderedOnMobile = ($scope.mobileRenderedTableColumns.length === $scope.tableColumns.length);
            }, true);

            $scope.$watch('monitoredSwarm', function () {
                $scope.logsFilter.availableFilters.monitoredSwarm = ($scope.monitoredSwarm || '');
            }, true);

            $scope.$watch('logsPagesCount', function () {
                $scope.currentPagesSet = 1;
                $scope.logsFilter.logsPage = 1;
            }, true);

            $scope.markAllLogTypes = function (allLogTypesChecked, logTypesList) {
                logTypesList.splice(0);
                if (allLogTypesChecked) {
                    $scope.logTypes.forEach((logType) => logTypesList.push(logType));
                }
            };

            $scope.renderColumns = function (allTableColumnsRendered, renderedColumnsList) {
                renderedColumnsList.splice(0);
                if (allTableColumnsRendered) {
                    $scope.tableColumns.forEach((column) => renderedColumnsList.push(column));
                }
            };

            $scope.resetTimestampFilter = function () {
                $scope.timestampStartValue = moment(0).toDate();
                $scope.timestampEndValue = moment().toDate();
            };

            $scope.toggleFilterSidenav = function () {
                $mdSidenav('filter-section-sidenav').toggle();
            };

            $scope.closeFilterSidenav = function () {
                $mdSidenav('filter-section-sidenav').close();
            };

            $scope.expandInfoPanel = function (infoPanelId) {
                expandedInfoPanelsId.push(infoPanelId);
                $mdExpansionPanel(infoPanelId).expand();
            };

            $scope.collapseInfoPanel = function (infoPanelId) {
                let foundPosition = expandedInfoPanelsId.indexOf(infoPanelId);
                if (foundPosition !== -1) {
                    $mdExpansionPanel(infoPanelId).collapse();
                    expandedInfoPanelsId.splice(foundPosition, 1);
                }
            };

            $scope.sortLogsBy = function (column, type) {
                $scope.logsFilter.availableFilters.orderBy = column;
                $scope.logsFilter.availableFilters.orderType = type;
            };

            $scope.previousPage = function () {
                if ($scope.logsFilter.logsPage - 1 >= 1) {
                    let startPage = $scope.PAGES_SET_SIZE * ($scope.currentPagesSet - 1) + 1;
                    --$scope.logsFilter.logsPage;
                    if ($scope.logsFilter.logsPage < startPage) {
                        $scope.goToPreviousPagesSet();
                    }
                }
            };

            $scope.nextPage = function () {
                if ($scope.logsFilter.logsPage + 1 <= $scope.logsPagesCount) {
                    let endPage = $scope.PAGES_SET_SIZE * $scope.currentPagesSet;
                    ++$scope.logsFilter.logsPage;
                    if ($scope.logsFilter.logsPage > endPage) {
                        $scope.goToNextPagesSet();
                    }
                }
            };

            $scope.pagesRange = function () {
                let pagesIndex = [];
                let startPage = $scope.PAGES_SET_SIZE * ($scope.currentPagesSet - 1) + 1;
                var endPage = $scope.PAGES_SET_SIZE > $scope.logsPagesCount ? $scope.logsPagesCount : $scope.PAGES_SET_SIZE * $scope.currentPagesSet;
                if (endPage > $scope.logsPagesCount) {
                    endPage = $scope.logsPagesCount;
                }
                for (let page = startPage; page <= endPage; ++page) {
                    pagesIndex.push(page);
                }
                return pagesIndex;
            };

            $scope.choosePage = function (pageNumber) {
                $scope.logsFilter.logsPage = pageNumber;
            };

            $scope.goToPreviousPagesSet = function () {
                if ($scope.currentPagesSet - 1 >= 1) {
                    --$scope.currentPagesSet;
                }
            };

            $scope.goToNextPagesSet = function () {
                if ($scope.currentPagesSet + 1 <= $scope.maxPagesSet) {
                    ++$scope.currentPagesSet;
                }
            };

            $scope.goToFirstPagesSet = function () {
                $scope.currentPagesSet = 1;
            };

            $scope.goToLastPagesSet = function () {
                $scope.currentPagesSet = $scope.maxPagesSet;
            };

            $scope.refreshLogs = function () {
                $scope.timestampEndValue = moment().toDate();
            };

            /**
             *
             * @param propertyName property of an object; it will be used to build the column title of the table column where
             * the property will be displayed
             * @returns {string} the title of the column where the property will be displayed
             * ex: toColumnTitle('functionName') will return "Function Name"
             */
            let toColumnTitle = function (propertyName) {
                let spacedPropertyName = propertyName.replace(/([A-Z])/g, " $1");
                let columnTitle = spacedPropertyName.charAt(0).toUpperCase() + spacedPropertyName.substr(1);
                return columnTitle;
            };

            $scope.shouldRenderColumn = function (propertyName) {
                return $scope.renderedTableColumns.indexOf(toColumnTitle(propertyName)) !== -1;
            };

            $scope.getPropertyValue = function (log, propertyName) {
                if (propertyName !== "timestamp" || !$scope.formattedDate) {
                    return log[propertyName];
                }
                return log.formattedDate;
            };

            let collapseExpandedInfoPanels = function () {
                expandedInfoPanelsId.forEach((infoPanelId) => $mdExpansionPanel(infoPanelId).collapse());
                expandedInfoPanelsId = [];
            };

            let isMobileDevice = function () {
                return $window.innerWidth <= 1223;
            };

            /**
             *
             * Callback to be used after fetchLogs is called. If no error, given the collectedLogs array and logsPagesCount,
             * this function will determine the log types, columns to be displayed and will set the $scope objects
             * properly.
             * @param error error message
             * @param swarmResult the result of the swarm call which finishes by calling this function passing collected data
             */
            let setLogsPageContent = function (error, swarmResult) {
                if (error) {
                    console.error(error);
                } else {
                    let isInitPageLogsCollect = swarmResult.collectParameters.isInitPageLogsCollect;
                    if (isInitPageLogsCollect && !isMobileDevice()) {
                        $scope.renderedTableColumns = [];
                        $scope.wantedLogTypes = [];
                    }
                    if (isInitPageLogsCollect) {
                        if (swarmResult.logs.length > 0) {
                            for (let prop in swarmResult.logs[0]) {
                                if (prop !== 'formattedDate') {
                                    let propertyColumnTitle = toColumnTitle(prop);
                                    if ($scope.tableColumns.indexOf(propertyColumnTitle) === -1) {
                                        $scope.tableColumns.push(propertyColumnTitle);
                                        if (!isMobileDevice()) {
                                            $scope.renderedTableColumns.push(propertyColumnTitle);
                                        }
                                    }
                                }
                            }
                        }
                        angular.copy(swarmResult.logTypes, $scope.logTypes);
                        if (!isMobileDevice()) {
                            angular.copy(swarmResult.logTypes, $scope.wantedLogTypes);
                        } else {
                            if ($scope.mobileWantedLogTypes.length > 0) {
                                angular.copy($scope.mobileWantedLogTypes, $scope.wantedLogTypes);
                            } else {
                                angular.copy(swarmResult.logTypes, $scope.mobileWantedLogTypes);
                                angular.copy(swarmResult.logTypes, $scope.wantedLogTypes);
                            }
                            if ($scope.mobileRenderedTableColumns.length > 0) {
                                angular.copy($scope.mobileRenderedTableColumns, $scope.renderedTableColumns);
                            } else {
                                angular.copy($scope.tableColumns, $scope.mobileRenderedTableColumns);
                                angular.copy($scope.tableColumns, $scope.renderedTableColumns);
                            }
                        }
                        $scope.fetchingPage = false;
                    }
                    $scope.logsFilter.availableFilters.types = $scope.wantedLogTypes;
                    $scope.logsFilter.availableFilters.renderedColumns = $scope.renderedTableColumns;
                    $scope.logs = swarmResult.logs;
                    $scope.logsPagesCount = swarmResult.pages;
                    $scope.maxPagesSet = Math.ceil($scope.logsPagesCount / $scope.PAGES_SET_SIZE);
                    $scope.fetchingLogs = false;
                    $scope.allLogTypesCheckedOnMobile = ($scope.mobileWantedLogTypes.length === $scope.logTypes.length);
                    $scope.allTableColumnsRenderedOnMobile = ($scope.mobileRenderedTableColumns.length === $scope.tableColumns.length);
                    $scope.$apply();
                    if (isInitPageLogsCollect) {
                        $scope.$watch('logsFilter', function (newFilter, oldFilter) {
                            if (newFilter !== oldFilter) {
                                collapseExpandedInfoPanels();
                                if (newFilter.availableFilters.renderedColumns.length > 0 &&
                                    newFilter.availableFilters.types.length > 0) {
                                    $scope.fetchLogs(false);
                                } else {
                                    $scope.logs = [];
                                    if (newFilter.availableFilters.renderedColumns.length > 0) {
                                        $scope.logsPagesCount = $scope.maxPagesSet = 0;
                                    }
                                }
                            }
                        }, true);
                    }
                }
            };

            /**
             * Callback used for swarmEsbEntitiesService.getSwarms function
             * @param swarmList names list of available system swarms collected by swarmEsbEntitiesService.getSwarms function
             */
            let setSwarmList = function (swarmList) {
                angular.copy(swarmList.sort(), $scope.swarmList);
            };

            /**
             *
             * This function is used to gather logs with logsService help.
             * @param isInitPageLogsCollect TRUE if the fetchLogs request is made when the controller
             * @param isMobileInitRequest
             * is created (on logs page initialize), FALSE otherwise
             */
            $scope.fetchLogs = function (isInitPageLogsCollect, isMobileInitRequest) {
                let collectParameters = {
                    isInitPageLogsCollect,
                    isMobileInitRequest
                };
                $scope.fetchingLogs = true;
                logsService.getLogs($scope.logsFilter, collectParameters, setLogsPageContent);
                if (isInitPageLogsCollect) {
                    swarmEsbEntitiesService.getSwarms(setSwarmList);
                }
            };

            $scope.overrideDefaultExpandBehaviour = function (event, infoPaneId) {
                event.preventDefault();
                $scope.expandInfoPanel(infoPaneId);
            };

            $scope.searchLogs = function (event, patternToMatch) {
                if (event.type === 'click' || event.keyCode === 13) {
                    $scope.logsFilter.availableFilters.patternToMatch = patternToMatch;
                }
            };

            $scope.saveMobileSettings = function () {
                if ($scope.mobileWantedLogTypes.length !== 0 && $scope.mobileRenderedTableColumns.length !== 0) {
                    let mobileWantedLogTypes = JSON.stringify($scope.mobileWantedLogTypes);
                    let mobileRenderedTableColumns = JSON.stringify($scope.mobileRenderedTableColumns);
                    localStorage.setItem("defaultMobileWantedLogTypes", mobileWantedLogTypes);
                    localStorage.setItem("defaultMobileRenderedTableColumns", mobileRenderedTableColumns);
                    angular.copy($scope.mobileWantedLogTypes, $scope.wantedLogTypes);
                    angular.copy($scope.mobileRenderedTableColumns, $scope.renderedTableColumns);
                    $scope.editingMobileSettings = false;
                    $scope.mobileSettingsError = false;
                } else {
                    $scope.mobileSettingsError = true;
                }
            };

            $scope.discardCurrentMobileSettings = function () {
                if (localStorage.defaultMobileWantedLogTypes) {
                    $scope.mobileWantedLogTypes = JSON.parse(localStorage.defaultMobileWantedLogTypes);
                } else {
                    angular.copy($scope.logTypes, $scope.mobileWantedLogTypes);
                }
                if (localStorage.defaultMobileRenderedTableColumns) {
                    $scope.mobileRenderedTableColumns = JSON.parse(localStorage.defaultMobileRenderedTableColumns);
                } else {
                    angular.copy($scope.tableColumns, $scope.mobileRenderedTableColumns);
                }
                $scope.editingMobileSettings = false;
                $scope.mobileSettingsError = false;
            };

            if (!isMobileDevice()) {
                $scope.fetchLogs(true);
            } else {
                $scope.fetchLogs(true, true);
            }
        }]);
