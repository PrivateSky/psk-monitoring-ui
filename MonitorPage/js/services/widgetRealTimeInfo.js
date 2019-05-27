angular.module('app')
    .service('widgetRealTimeInfo', function (swarmHubService, $interval) {
        var intervalSwarmCalls = {};
        var hub = swarmHubService.hub;

        return {
            addSwarmCall: function (name, newRequestInterval, callback) {
                var index = name + newRequestInterval.interval;
                
                if (!intervalSwarmCalls[index]) {
                    intervalSwarmCalls[index] = {};
                    intervalSwarmCalls[index] = newRequestInterval;
                    intervalSwarmCalls[index]['nrRequests'] = 0;
                    intervalSwarmCalls[index].callbacks = [callback];
                    intervalSwarmCalls[index]['promise'] = $interval(function () {
                        var callbackListener = function (swarm) {
                            // hub.off(newRequestInterval.swarm, newRequestInterval.arguments.phase, callbackListener);
                            // intervalSwarmCalls[index].callbacks.forEach(function (callback) {
                            //     if (callback) {
                            //         callback(swarm);
                            //     }
                            // })
                        };

                        // hub.on(newRequestInterval.swarm, newRequestInterval.arguments.phase, callbackListener);
                        const x = hub.startSwarm(newRequestInterval.swarm, newRequestInterval.ctor, newRequestInterval.arguments);
                        x.on({
                            [newRequestInterval.arguments.phase]: callbackListener
                        })

                        console.log('AM DAT DE X', x);
                        
                    }, newRequestInterval.interval * 100000);
                } else {
                    intervalSwarmCalls[index]['nrRequests']++;
                    intervalSwarmCalls[index].callbacks.push(callback)
                }

                return function (callback) {
                    if (intervalSwarmCalls[index]) {
                        if (intervalSwarmCalls[index]['nrRequests'] > 0) {
                            intervalSwarmCalls[index]['nrRequests']--;
                            var idx = intervalSwarmCalls[index].callbacks.indexOf(callback);
                            if (idx != -1) {
                                intervalSwarmCalls[index].callbacks.splice(idx, 1);
                            }
                        }
                        else {
                            $interval.cancel(intervalSwarmCalls[index]['promise']);
                            intervalSwarmCalls[index] = undefined;
                        }
                    }
                }
            }
        }
    });
