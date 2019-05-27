/**
 * @author Dorneanu Dragos-Andrei(dragos.a.dorneanu@gmail.com) on 9/24/17
 */
angular.module('app')
    .service('swarmEsbEntitiesService', ['swarmHubService', function (swarmHubService) {
        'use strict';

        let hub = swarmHubService.hub;

        return {
            getSwarms: function (setSwarmList) {
                hub.startSwarm('monitorClient.js', 'listSwarms');

                hub.on('monitorClient.js', 'listSwarmsDone', function (listSwarmsResult) {
                    setSwarmList(listSwarmsResult.swarmList);
                });
            },
            getAdapters: function (setAdapterList) {
                hub.startSwarm('adaptersCollectorSwarm.js', 'collect');

                hub.on('adaptersCollectorSwarm.js', 'gotAdapterList', function (swarmResult) {
                    setAdapterList(undefined, swarmResult.adapterList);
                });

                hub.on('adaptersCollectorSwarm.js', 'failedAdaptersCollect', function (swarmResult) {
                    setAdapterList('Failed to collect adapter list');
                })
            }
        };
    }]);
    