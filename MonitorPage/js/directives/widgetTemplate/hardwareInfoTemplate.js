angular.module('app').directive('hardwareInfoTemplate', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model",
            showSettings: "&",
        },
        template:
        "<accordion class='disk-accordion'  close-others=false >" +
        "       <accordion-group heading='Disk nr.{{$index}}'  class='m-t-sm' ng-repeat='data in widget.options.data' ng-click='checkHeight()'>" +
        "           <div class='inline list-group-item col-xs-12 ' ng-repeat='(key, value) in data' ng-if='value'>" +
        "                   <span class='label bg-success pos-rlt m-r inline wrapper-xs text-white'>" +
        "                           <i class='arrow right arrow-success'></i> {{key}}" +
        "                   </span> " +
        "           <div class='pull-right'>{{value}}</div>" +
        "           </div>" +
        "       </accordion-group>" +
        "</accordion>",
        controller: function ($scope) {
            $scope.checkHeight = function () {
                $scope.$emit('reload-widget', true);
            };
        }

    };
});