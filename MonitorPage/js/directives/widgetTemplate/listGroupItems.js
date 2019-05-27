angular.module('app').directive('listGroupItems', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        "   <div >" +
        "       <div class='list-group-item' ng-repeat='elem in widget.options.labels |limitTo:widget.options.auxData.limitItemsDisplayed'>" +
        "           <span class='badge' ng-class=badge>{{widget.options.data[$index]}}</span>" +
        "       {{elem}}</div>" +
        "   </div>"
        , controller: function ($scope) {
            switch ($scope.widget['data-source'].phase) {
                case "statsTables":
                    $scope.badge = 'bg-success';
                    break;
                case "statsDatabase":
                    $scope.badge = 'badge-empty';
                    break;
                case "topErrors":
                    $scope.badge = 'bg-danger';
                    break;
            }
        }

    };
});