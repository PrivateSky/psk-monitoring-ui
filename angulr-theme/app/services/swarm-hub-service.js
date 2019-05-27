angular.module('swarm', [])
    .service('swarmHubService', function () {
        const interact = pskclientRequire('interact');
        interact.enableRemoteInteractions();
        this.hub = interact.createRemoteInteractionSpace('monitorRemote', 'http://127.0.0.1:8080', 'monitor/agent/system');
    });
