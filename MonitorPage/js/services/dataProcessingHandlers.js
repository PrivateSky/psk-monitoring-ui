angular.module('app')
    .service('dataProcessingHandlers', function () {
        var widgetSwarmCalls = {};

        window.getValueOfChain = function (target, propertiesChain) {
            var result = 0;
            var intermediat = target;
            var i = 0;
            while (intermediat && i < propertiesChain.length) {
                intermediat = intermediat[propertiesChain[i]];
                i++;
            }
            if (i === propertiesChain.length) {
                result = intermediat;
            }
            return result;
        };

        var wrapper = function (name, func) {
            return function (swarm, callback, $scope) {
                $scope.invalidData = true;
                if (swarm[name]) {
                    var res = func($scope, swarm);
                    $scope.invalidData = res ? res : false;
                }
                $scope.fetchingData = false;
                callback();
            }
        };

        widgetSwarmCalls["statsDatabase"] = wrapper("statsDatabase", function ($scope, swarm) {
            var data = [];
            var labels = [];

            for (let atr in swarm.statsDatabase) {
                labels.push(atr);
                data.push(swarm.statsDatabase[atr]);
            }

            $scope.widget.options.data = data;
            $scope.widget.options.labels = labels;
        });

        widgetSwarmCalls["queriesPerSecond"] = wrapper("queriesPerSecond", function ($scope, swarm) {
            let propertiesChain = ["widget", "options", "options", "scales", "xAxes", 0, "ticks", "max"];
            var data = swarm.queriesPerSecond.slice(Math.max(swarm.queriesPerSecond.length - getValueOfChain($scope, propertiesChain) - 1, 1)).map(function (elem, index) {
                return {x: index, y: elem}
            });

            $scope.widget.options.data = data;
        });

        widgetSwarmCalls["statsTables"] = wrapper("statsTables", function ($scope, swarm) {
            var res = true;
            var data = [];
            var labels = [];
            if (swarm.statsTables.length > 0) {
                for (let index in swarm.statsTables) {
                    labels.push(swarm.statsTables[index].table_name);
                    data.push(swarm.statsTables[index].tablesize_mb);
                }
                res = false;
            }
            $scope.widget.options.data = data;
            $scope.widget.options.labels = labels;
            return res;
        });

        widgetSwarmCalls["topErrors"] = wrapper("topErrors", function ($scope, swarm) {
            var res = true;
            var data = [];
            var labels = [];

            if (swarm.topErrors.length > 0) {
                for (let index in swarm.topErrors) {
                    labels.push(swarm.topErrors[index].fileName);
                    data.push(swarm.topErrors[index].countErrors);
                }
                res = false;
            }

            $scope.widget.options.data = data;
            $scope.widget.options.labels = labels;
            return res;
        });

        widgetSwarmCalls["memory"] = wrapper("memory", function ($scope, swarm) {
            const data = [];
            const labels = [];

            console.log('memory swarm', swarm);
            

            for (const atr in swarm.memory) {
                labels.push(atr);
                console.log(swarm.memory[atr], swarm.memory[atr] / Math.pow(1024, 2));

                data.push(Math.round(swarm.memory[atr] / Math.pow(1024, 2)));
            }

            $scope.widget.options.data = data;
            $scope.widget.options.labels = labels;

            console.log('populating memory chart', data);
            
        });

        widgetSwarmCalls["memPerSec"] = wrapper("memPerSec", function ($scope, swarm) {
            var data = [];
            var total = [];
            total.push({key: 'Memory used', values: [], area: true});
            total.push({key: 'Free memory', values: [], area: true});
            data = swarm.memPerSec.slice(Math.max(swarm.memPerSec.length - 61, 1)).reduce(function (total, currentValue, currentIndex) {
                total[0].values.push([Math.round(currentValue.used / currentValue.total * 100), currentIndex]);
                total[1].values.push([100 - Math.round(currentValue.used / currentValue.total * 100), currentIndex]);
                return total;
            }, total);

            $scope.widget.options.data = data;
        });

        widgetSwarmCalls["statsAdapter"] = wrapper("statsAdapter", function ($scope, swarm) {
            var res = true;
            if (swarm.statsAdapter.length > 0) {
                var data = [];
                var labels = [];
                for (let atr in swarm.statsAdapter) {
                    labels.push(swarm.statsAdapter[atr].type);
                    data.push(swarm.statsAdapter[atr].countLogsType);
                }
                $scope.data = swarm.nrRestartsAdapter[0].countRestarts || 0;
                $scope.widget.options.data = data;
                $scope.widget.options.labels = labels;
                res = false;
            }
            return res;
        });

        widgetSwarmCalls["systemLoad"] = wrapper("systemLoad", function ($scope, swarm) {
            let data = [];
            let labels = [];
            let propertiesChain = ["widget", "options", "options", "scales", "xAxes", 0, "ticks", "max"];

            data = swarm.systemLoad.slice(Math.max(swarm.systemLoad.length - getValueOfChain($scope, propertiesChain) - 1, 0)).map(function (elem, index) {
                return {x: index, y: elem}
            });

            $scope.widget.options.data = data;
            $scope.widget.options.labels = labels;

            console.log('setting data', data, 'with labels', labels);
            
        });

        widgetSwarmCalls["allNumbers"] = wrapper("allNumbers", function ($scope, swarm) {
            $scope.widget.options.data = swarm;
        });

        widgetSwarmCalls["disksIO"] = wrapper("disksIO", function ($scope, swarm) {
            var res = true;
            if (swarm.disksIO.length > 1) {
                var data = [];
                var total = [];
                total.push({key: 'ReadsIO', values: []});
                total.push({key: 'WritesIO', values: []});
                data = swarm.disksIO.slice(Math.max(swarm.disksIO.length - 55, 1)).reduce(function (total, currentValue, currentIndex) {
                    total[0].values.push([currentValue.rIO_sec, currentIndex]);
                    total[1].values.push([currentValue.wIO_sec, currentIndex]);

                    return total;
                }, total);
                res = false;
                $scope.widget.options.data = data;
            }
            return res;
        });

        widgetSwarmCalls["diskLayout"] = wrapper("diskLayout", function ($scope, swarm) {
            var res = true;
            if (swarm.diskLayout.length) {
                var data = [];
                swarm.diskLayout.forEach(function (disk) {
                    for (let atr in disk) {
                        if (!disk[atr] || disk[atr] === -1) {
                            disk[atr] = null;
                        }
                    }
                    data.push(disk);
                });
                res = false;
                $scope.widget.options.data = data;
            }
            return res;
        });

        return {
            getHandlerByName: function (name) {
                return widgetSwarmCalls[name];
            },
            registerHandler: function (name, handler) {
                if (!widgetSwarmCalls[name]) {
                    widgetSwarmCalls[name] = wrapper(name, handler);
                } else {
                    console.warn("Warning: Already registered handler for name " + name);
                }
            }
        }
    });
