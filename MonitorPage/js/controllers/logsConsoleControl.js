/**
 * @author Dorneanu Dragos-Andrei(dragos.a.dorneanu@gmail.com) on 9/13/17
 */
angular.module('app')
    .controller('logsConsoleController', ['$scope', '$interval', '$element', 'logsService', 'moment', 'logsConsoleConstants', 'swarmEsbEntitiesService',
        function ($scope, $interval, $element, logsService, moment, logsConsoleConstants, swarmEsbEntitiesService) {
            'use strict';

            $scope.availableLogsText = '\n';
            $scope.currentLogsConsole = 'Adapters';
            $scope.lowerTimestamp = moment().valueOf() - logsConsoleConstants.ONE_MINUTE;
            $scope.editSettings = false;
            $scope.displayErrorMessage = false;
            $scope.availableLogsProperties = [];
            $scope.renderedLogsProperties = [];
            $scope.renderAllLogInfo = true;
            $scope.swarmList = [];
            $scope.adapterList = [];
            $scope.monitoredSwarms = [];
            $scope.monitoredAdapters = [];
            $scope.monitorAllAdapters = true;
            $scope.monitorAllSwarms = true;
            $scope.logsDisplayModality = 'stack';
            $scope.availableDisplayModalities = ['stack', 'inline'];
            $scope.logsPropertiesOrder = [];
            $scope.logsPropertiesToOrder = [];
            $scope.errorMessage = '';
            $scope.console = $element.find('#console')[0];

            angular.element(document.querySelector('#console')).bind('scroll', function () {
                $scope.existsScrollableContent = ($scope.console.scrollTop + $scope.console.offsetHeight < $scope.console.scrollHeight);
                $scope.$apply();
            });

            $scope.toPropertyTitle = function (propertyName) {
                let spacedPropertyName = propertyName.replace(/([A-Z])/g, " $1");
                let propertyTitle = spacedPropertyName.charAt(0).toUpperCase() + spacedPropertyName.substr(1);
                return propertyTitle;
            };

            $scope.toCamelCase = function (str) {
                str = str.replace(/ /g, "");
                str = str.charAt(0).toLowerCase() + str.substr(1);
                return str;
            };

            $scope.clearConsole = function () {
                $scope.availableLogsText = '\n';
                $scope.lowerTimestamp = moment().valueOf();
            };

            $scope.selectCurrentLogsConsole = function (newLogsConsole) {
                $scope.currentLogsConsole = newLogsConsole;
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
            };

            $scope.displayLogs = function (logsList) {
                let newConsoleText = '\n';
                logsList.forEach((log) => {
                    $scope.logsPropertiesOrder.forEach((propertyTitle, index, orderList) => {
                        if ($scope.renderedLogsProperties.indexOf(propertyTitle) !== -1) {
                            let camelCaseProperty = $scope.toCamelCase(propertyTitle);
                            if ($scope.logsDisplayModality === 'stack') {
                                newConsoleText += '> ';
                                newConsoleText += `${propertyTitle}: ${log[camelCaseProperty]}\n`;
                            } else {
                                newConsoleText += `${propertyTitle}: ${log[camelCaseProperty]}`;
                                if (index < orderList.length - 1) {
                                    newConsoleText += ' | ';
                                }
                            }
                        }
                    });
                    if ($scope.logsDisplayModality === 'stack') {
                        newConsoleText += logsConsoleConstants.CONSOLE_LOGS_DIVIDER;
                    } else {
                        newConsoleText += '\n\n';
                    }
                });
                if (!angular.equals($scope.availableLogsText, newConsoleText)) {
                    $scope.availableLogsText = newConsoleText;
                    $scope.existsScrollableContent = ($scope.console.scrollTop + $scope.console.offsetHeight < $scope.console.scrollHeight);
                    $scope.$apply();
                }
            };

            $scope.getFilesLogs = function (fileList) {
                logsService.getFilesLogs(fileList, $scope.lowerTimestamp, function (error, swarmResult) {
                    $scope.displayLogs(swarmResult.filesLogs);
                    if (swarmResult.filesLogs.length > 0 && $scope.availableLogsProperties.length === 0) {
                        initAvailableLogsProperties(swarmResult.filesLogs[0]);
                        revertToSavedSettings();
                    }
                });
            };

            $scope.saveSettingsMenu = function () {
                $scope.errorMessage = '';
                if ($scope.availableLogsProperties.length > 0) {
                    if ($scope.renderedLogsProperties.length <= 0) {
                        $scope.errorMessage += 'Choose at least one log information to be displayed. ';
                    }
                    if ($scope.logsPropertiesToOrder.length !== $scope.logsPropertiesOrder.length) {
                        $scope.errorMessage += 'Choose the order of all available logs information. ';
                    }
                    if ($scope.errorMessage === '') {
                        let renderedLogsProperties = JSON.stringify($scope.renderedLogsProperties);
                        let logsDisplayModality = JSON.stringify($scope.logsDisplayModality);
                        let logsPropertiesOrder = JSON.stringify($scope.logsPropertiesOrder);

                        $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
                        $scope.editSettings = false;
                        $scope.displayErrorMessage = false;
                        $scope.errorMessage = '';
                        localStorage.setItem('defaultRenderedLogsInformation', renderedLogsProperties);
                        localStorage.setItem('defaultLogsDisplayModality', logsDisplayModality);
                        localStorage.setItem('defaultLogsPropertiesOrder', logsPropertiesOrder);
                    } else {
                        $scope.displayErrorMessage = true;
                    }
                }
            };

            let revertToSavedSettings = function () {
                let defaultRenderedLogsProperties = JSON.parse(localStorage.getItem('defaultRenderedLogsInformation'));
                let defaultLogsDisplayModality = JSON.parse(localStorage.getItem('defaultLogsDisplayModality'));
                let defaultLogsPropertiesOrder = JSON.parse(localStorage.getItem('defaultLogsPropertiesOrder'));

                angular.copy(defaultLogsPropertiesOrder || $scope.availableLogsProperties, $scope.logsPropertiesOrder);
                angular.copy(defaultRenderedLogsProperties || $scope.availableLogsProperties, $scope.renderedLogsProperties);
                $scope.logsDisplayModality = defaultLogsDisplayModality || 'stack';
            };

            $scope.discardSettings = function () {
                revertToSavedSettings();
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
                $scope.editSettings = false;
            };

            $scope.renderAllLogProperties = function (shouldRenderAllProperties) {
                $scope.renderedLogsProperties.splice(0);
                if (shouldRenderAllProperties) {
                    $scope.availableLogsProperties.forEach((prop) => {
                        $scope.renderedLogsProperties.push(prop);
                    });
                }
            };

            $scope.refreshConsole = function () {
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
            };

            $scope.insertIntoLogsPropertiesOrder = function (property) {
                $scope.logsPropertiesOrder.push(property);
            };

            $scope.changeFileMonitorStatus = function (monitoredFilesList, fileName) {
                event.stopPropagation();
                let foundPosition = monitoredFilesList.indexOf(fileName);
                if (foundPosition === -1) {
                    monitoredFilesList.push(fileName);
                } else {
                    monitoredFilesList.splice(foundPosition, 1);
                }
            };

            $scope.chunkMonitoredFileList = function (monitoredFilesList) {
                if (monitoredFilesList.length > 3) {
                    return [monitoredFilesList[0] + ', ', monitoredFilesList[1] + ', ', monitoredFilesList[2], '...'];
                }
                return monitoredFilesList.map((fileName, index, files) => {
                    if (index < files.length - 1) {
                        return fileName + ', ';
                    }
                    return fileName;
                });
            };

            $scope.monitorAllFiles = function (fileList, monitoredFilesList, monitorAll, event) {
                event.stopPropagation();
                monitorAll = !monitorAll;
                if (monitorAll) {
                    angular.copy(fileList, monitoredFilesList);
                } else {
                    monitoredFilesList.splice(0);
                }
            };

            $scope.isMonitoredFile = function (fileName, monitoredFilesList) {
                return monitoredFilesList.indexOf(fileName) !== -1;
            };

            $scope.startAnotherLogsPropertiesOrder = function () {
                $scope.logsPropertiesOrder = [];
                angular.copy($scope.availableLogsProperties, $scope.logsPropertiesToOrder);
            };

            $scope.scrollToBottom = function () {
                $scope.console.scrollTop = $scope.console.scrollHeight;
            };

            $scope.currentMonitoredFiles = {
                'Adapters': $scope.monitoredAdapters,
                'Swarms': $scope.monitoredSwarms
            };

            $scope.$watch('monitoredAdapters', function () {
                $scope.monitorAllAdapters = angular.equals($scope.monitoredAdapters.sort(), $scope.adapterList.sort());
                $scope.currentMonitoredFiles['Adapters'] = $scope.monitoredAdapters;
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
            }, true);

            $scope.$watch('monitoredSwarms', function () {
                $scope.monitorAllSwarms = angular.equals($scope.monitoredSwarms.sort(), $scope.swarmList.sort());
                $scope.currentMonitoredFiles['Swarms'] = $scope.monitoredSwarms;
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
            }, true);

            $scope.$watch('renderedLogsProperties', function () {
                $scope.renderAllLogInfo = ($scope.renderedLogsProperties.length === $scope.availableLogsProperties.length);
            }, true);

            let initAvailableLogsProperties = function (log) {
                for (let prop in log) {
                    $scope.availableLogsProperties.push($scope.toPropertyTitle(prop));
                }
                angular.copy($scope.availableLogsProperties, $scope.logsPropertiesToOrder);
            };

            $scope.renderAllLogProperties(true);

            swarmEsbEntitiesService.getAdapters(function (error, adapterList) {
                if (error) {
                    console.error(error);
                } else {
                    $scope.adapterList = adapterList;
                    angular.copy(adapterList, $scope.monitoredAdapters);
                    $scope.$apply();
                }
            });

            swarmEsbEntitiesService.getSwarms(function (swarmList) {
                $scope.swarmList = swarmList;
                angular.copy(swarmList, $scope.monitoredSwarms);
                $scope.$apply();
            });

            $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);

            let interval = $interval(function () {
                $scope.getFilesLogs($scope.currentMonitoredFiles[$scope.currentLogsConsole]);
            }, 5000);

            $scope.$on('$destroy', function () {
               $interval.cancel(interval);
            });
        }
    ]);
