angular.module('app').directive('chartDirective', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=item"
        },
        templateUrl: 'tpl/parts/chartjsDirective.html',
        controller: function ($scope) {
            $scope.$on('chart-create', (event, chart) => {
                $scope.chart = chart;
            });
            $scope.$watch('widget', function () {
                if ($scope.chart) {
                    $scope.chart.update();
                }
            });
        }
    };
});
