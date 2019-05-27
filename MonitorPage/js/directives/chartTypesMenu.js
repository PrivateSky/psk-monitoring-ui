angular.module('app').directive('chartTypesMenu', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        '<div ng-if="currentChartTypes">' +
            '<div class="form-group"  >' +
            '    <label class="col-sm-3 col-md-3 col-xs-6 control-label text-right-xs ">Chart-type:</label>' +
                '<div class="dropdown col-sm-2 col-xs-4" dropdown>' +
                     '<button class="btn btn-default btn-xs m-t-xs" dropdown-toggle>' +
                        '{{widget.options.type}}<span class="caret"></span>' +
                     '</button>' +
                     '<ul class="dropdown-menu  m-l-lg ">' +
                            '<li ng-repeat="chartType in currentChartTypes track by $index">' +
                                '<a ng-click="widget.options.type=chartType">{{chartType}}</a>' +
                            '</li>' +
                     '</ul>' +
                 '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>'+
        '</div>',
        controller: function ($scope) {
            $scope.currentChartTypes =$scope.widget.options.charts ;
        }
    }
});
