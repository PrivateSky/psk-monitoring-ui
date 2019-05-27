angular.module('app').directive('nvdDirective', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=item"
        },
        templateUrl: 'tpl/parts/nvdDirective.html',
        link: function ($scope, element, attrs) {

            switch ($scope.widget["data-source"].phase) {
                case "disksIO":

                    $scope.widget.options.options.chart.x = function (d) {
                        return d[1];
                    };
                    $scope.widget.options.options.chart.y = function (d) {
                        return d[0];
                    };
                    $scope.widget.options.options.chart.color = d3.scale.category10().range();
                    break;
                case "memPerSec":
                    $scope.widget.options.options.chart.x = function (d) {
                        return d[1];
                    };
                    $scope.widget.options.options.chart.y = function (d) {
                        return d[0];
                    };
                    $scope.widget.options.options.chart.color = d3.scale.category10().range();
                    $scope.widget.options.options.chart.yAxis.tickFormat = function (d) {
                        return d + '%';
                    };
                    break;
                case "Network":

                    $scope.widget.options.options.chart.color = d3.scale.category20().range();
                    $scope.widget.options.options.chart.nodeExtras = function (node) {
                        node && node
                            .append("text")
                            .text(function (d) {
                                return d.name
                            })
                            .style('font-size', '10px');
                    };
                    break;
            };
            
            $scope.widget.options.config = {deepWatchDataDepth: 0};

            $scope.$watch(
                function () {
                    return {
                        width: element.parent().width(),
                        height: element.parent().height(),
                    }
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.widget.options.api.update()
                    }
                },
                true
            );
        }
    };
});
