angular.module('app').directive('miniWidgetDirective', function (swarmHubService, widgetRealTimeInfo) {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model",
        },
        template:
        ' <div ng-if="!invalidData && !fetchingData">' +
        '        <progress-bar name="name" data="widget.options.data" type="type"></progress-bar>' +
        ' </div>' +
        ' <div  ng-if="invalidData && !fetchingData">' +
        '        <i class="glyphicon glyphicon-warning-sign"></i>' +
        '        No data!' +
        ' </div>' +
        ' <div  ng-if="fetchingData">' +
        '        <i class="glyphicon  glyphicon-search"></i>' +
        '        Fetching...' +
        ' </div>',
        controller: function ($scope) {
            let hub = swarmHubService.hub;
            $scope.invalidData = false;
            $scope.fetchingData = true;

            let miniWidgetSwarmCalls = {};

            var wrapper = function (name, func) {
                return function (swarm) {
                    $scope.invalidData = true;
                    if (swarm[name]) {
                        var res = func(swarm);
                        $scope.invalidData = res ? res : false;
                    }
                    $scope.fetchingData = false;
                }
            };

            function thresholdState(data) {
                if (data < 40) return 'success';
                if (data < 65) return'warning';
                return 'danger';
            }

            miniWidgetSwarmCalls["memory"] = wrapper("memory", function (swarm) {
                var data = [];
                data = Math.round(swarm.memory.used / swarm.memory.total * 100);
                $scope.name = 'Memory';
                $scope.type = thresholdState(data);
                $scope.widget.options.data = data;
            });
            
            miniWidgetSwarmCalls["systemLoad"] = wrapper("systemLoad", function (swarm) {
                var data = [];
                data = Math.round(swarm.systemLoad[swarm.systemLoad.length - 1]);
                $scope.name = 'Cpu';
                $scope.type = thresholdState(data);
                $scope.widget.options.data = data;
            });

            var miniWidgetCallback = function (swarm) {
                if (!$scope.widget.options.liveInfo) {
                    // hub.off($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, miniWidgetCallback);
                }
                miniWidgetSwarmCalls[$scope.widget["data-source"].phase](swarm);
            };

            $scope.realTimeInfo = function () {
                if ($scope.widget.options.liveInfo) {
                    var destroySwarmCall = widgetRealTimeInfo.addSwarmCall($scope.widget["swarm-arguments"].phase, {
                        interval: $scope.widget.options.liveRequestTime ? $scope.widget.options.liveRequestTime : 2,
                        swarm: $scope.widget["data-source"].swarm,
                        ctor: $scope.widget["data-source"].ctor,
                        arguments: $scope.widget["swarm-arguments"]
                    }, miniWidgetCallback);
                    $scope.$on('$destroy', function () {
                        destroySwarmCall(miniWidgetCallback);
                    });
                }
                else {
                    // hub.on($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, miniWidgetCallback);
                    hub.startSwarm($scope.widget["data-source"].swarm, $scope.widget["data-source"].phase, $scope.widget["swarm-arguments"]).onReturn(miniWidgetCallback);
                }
            };

            $scope.realTimeInfo();
        }
    }
});
