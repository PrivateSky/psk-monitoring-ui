angular.module('app').directive('widget', function (swarmHubService, $interval, $timeout, widgetsInfo, widgetRealTimeInfo, dataProcessingHandlers) {
    return {
        restrict: 'E',
        scope: {
            widget: "=model",
            state: "=",
            index: "=",
            deleteWidget: "&",
            limit: "=limit"
        },
        templateUrl: 'tpl/parts/widget.html',
        controller: function ($scope, pageStates) {
            let hub = swarmHubService.hub;
            let dataReceived = false;

            $scope.checkSettings = false;
            $scope.invalidData = false;
            $scope.fetchingData = true;
            $scope.pageStates = pageStates;
            $scope.isCollapsed = false;
            $scope.widgetSize = widgetsInfo.SIZE;
            $scope.widget.options.auxData = {limitItemsDisplayed: $scope.limit ? $scope.limit : undefined};

            console.log('SUNT WIDGET SI SUNT CHEMAT');
            

            $scope.showSettings = function () {
                $scope.isCollapsed = !$scope.isCollapsed;
            };

            $scope.resizeWidget = function (widget) {
                let widgetSize = Object.keys(widgetsInfo.SIZE);
                widget.size = widget.size === widgetSize[0] ? widgetSize[1] : widgetSize[0];
                $scope.$emit('reload-widget', true);
            };

            $scope.dataReceived = function () {
                if ($scope.widget.options.liveInfo !== undefined || $scope.widget.templateSettings || $scope.widget.options.charts) {
                    $scope.checkSettings = true;
                }

                if($scope.widget.options.liveInfo) {
                    // reload widget only once when live mode is active
                    if(!dataReceived) {
                        $scope.$emit('reload-widget', true);
                    }
                } else {
                    $scope.$emit('reload-widget', true);
                }

                dataReceived = true;
            };

            /*TODO: find a solution for this case...
            *
            * */
            if (getValueOfChain($scope, ["widget", "swarm-arguments", "phase"]) == "statsAdapter") {
                $scope.$watch(function ($scope) {
                    return getValueOfChain($scope, ["widget", "options", "options", "title", "text"]);
                }, function () {
                    let title = getValueOfChain($scope, ['widget', 'options', 'options', 'title', 'text']);
                    let currentAdapter = getValueOfChain($scope, ['widget', 'swarm-arguments', 'adapter']);
                    if (currentAdapter !== title) {
                        $scope.widget["swarm-arguments"].adapter = title;
                        $scope.fetchingData = true;
                        // hub.on($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, dataProcessingHandler);

                        console.log('am chemat ceva cu nume??? ', title);
                        
                        hub.startSwarm($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, $scope.widget["swarm-arguments"]).onReturn(dataProcessingHandler);
                    }
                });
            }

            var dataProcessingHandler = function (swarm) {
                //get data handler by widget type
                var dataHandler = dataProcessingHandlers.getHandlerByName($scope.widget["data-source"].phase);

                if (dataHandler) {
                    dataHandler(swarm, $scope.dataReceived, $scope);
                } else {
                    console.log("Unknown widget type", getValueOfChain($scope, ["widget", "swarm-arguments", "phase"]));
                }

                // if (!getValueOfChain($scope, ["widget", "options", "liveinfo"])) {
                //     hub.off($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, dataProcessingHandler);
                // }
            };

            var errorFunction = function (swarm) {
                if (swarm.meta.phaseStack[0] === $scope.widget["data-source"].phase) {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        message: getValueOfChain($scope, ["widget", "data-source", "phase"]) + ':' + angular.toJson(swarm.error)
                    }, {
                        type: 'danger'
                    });
                    $scope.invalidData = true;
                    $scope.fetchingData = false;
                }
            };

            // hub.on($scope.widget["data-source"].swarm, "error", errorFunction);

            $scope.$on('$destroy', function () {
                // hub.off($scope.widget["data-source"].swarm, "error", errorFunction);
            });

            $scope.realTimeInfo = function () {
                if ($scope.widget.options.liveInfo) {
                    var destroySwarmCall = widgetRealTimeInfo.addSwarmCall(getValueOfChain($scope, ["widget", "data-source", "phase"]), {
                        interval: $scope.widget.options.liveRequestTime ? $scope.widget.options.liveRequestTime : 2,
                        swarm: getValueOfChain($scope, ["widget", "data-source", "swarm"]),
                        ctor: getValueOfChain($scope, ["widget", "data-source", "ctor"]),
                        arguments: $scope.widget["swarm-arguments"]
                    }, dataProcessingHandler);
                    $scope.$on('$destroy', function () {
                        destroySwarmCall(dataProcessingHandler);
                    });
                }
                else {
                    console.log('ok, starting swarm ', $scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, $scope.widget["swarm-arguments"]);
                    
                    // hub.on($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, dataProcessingHandler);
                    hub.startSwarm($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, $scope.widget["swarm-arguments"]).onReturn(dataProcessingHandler);
                }
            };

            $scope.realTimeInfo();
        }
    }
});
