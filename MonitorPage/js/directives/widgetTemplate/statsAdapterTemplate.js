angular.module('app').directive('statsAdapterTemplate', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"

        },
        template:
        "<ul class='list-group no-radius m-b-none'>" +
        "   <li class='list-group-item' >" +
        "       <span class='label pull-right bg-primary' >{{widget.options.auxData}}</span>" +
        "       Nr of restarts</li>" +
        "   <li class='list-group-item' ng-repeat='elem in widget.options.labels' >" +
        "       <span class='label pull-right' style='background-color: {{widget.options.options.colours[$index]}};'>{{widget.options.data[$index]}}</span>" +
        "       {{elem}} logs" +
        "   </li> " +
        "</ul>"


    }
})
;
