angular.module('app').directive('activeAdapters', function (swarmHubService) {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        "<div >" +
        "       <div class='form-group'>" +
        "           <label class='col-sm-3 col-md-3 col-xs-6 control-label text-right-xs'>Adapters:</label>" +
        "           <div class='dropdown col-sm-2 col-xs-4' dropdown>" +
        "               <button class='btn btn-default btn-xs m-t-xs' dropdown-toggle>{{widget.options.options.title.text}}<span class='caret'></span></button>" +
        "               <ul class='dropdown-menu m-l-lg'>" +
        "                   <li ng-repeat='adapter in adapters'>" +
        "                       <a ng-click='widget.options.options.title.text=adapter'>{{adapter}}</a>" +
        "                   </li>" +
        "               </ul>" +
        "           </div>" +
        "       </div>" +
        "</div>",
        controller: function ($scope) {
            let hub = swarmHubService.hub;
            hub.startSwarm("widgetInfoSwarm", "widgetInfo", {"phase": "activeAdapters"}).onReturn((activeAdapters) => {
                $scope.adapters = activeAdapters;
            })
            // hub.on("widgetInfoSwarm.js", "activeAdapters", function (swarm) {
            //     $scope.adapters = swarm.activeAdapters;
            //     hub.off("widgetInfoSwarm.js", "activeAdapters", function (swarm) {
            //     });
            // });
        }

    }
})
;
