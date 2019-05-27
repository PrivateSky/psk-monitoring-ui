/**
 * @author Dorneanu Dragos-Andrei(dragos.a.dorneanu@gmail.com) on 8/8/17
 */
angular.module('app')
    .service('logsService', ['swarmHubService', function (swarmHubService) {
        'use strict';

        let hub = swarmHubService.hub;

        return {
            getLogs: function (filter, collectParameters, callback) {
                hub.startSwarm('logsCollectorSwarm.js', 'collect', filter, collectParameters);

                hub.on('logsCollectorSwarm.js', 'gotFilteredLogs', function (swarmResult) {
                    callback(undefined, swarmResult);
                });

                hub.on('logsCollectorSwarm.js', 'failedLogsFilter', function (swarmResult) {
                    callback('Error occurred while fetching logs');
                });
            },
            getFilesLogs: function (fileList, lowerTimestamp, callback) {

                hub.on('logsCollectorSwarm.js', 'gotFilesLogs', function (swarmResult) {
                    callback(undefined, swarmResult);
                });

                hub.on('logsCollectorSwarm.js', 'failedFilesLogsCollect', function (swarmResult) {
                    callback('Failed to collect swarms logs');
                })

                hub.startSwarm('logsCollectorSwarm.js', 'collectFilesLogs', fileList, lowerTimestamp);
            }
        }
    }]);
