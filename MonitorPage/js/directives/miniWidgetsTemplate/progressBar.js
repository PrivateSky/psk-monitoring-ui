angular.module('app').directive('progressBar', function () {
    return {
        restrict: 'E',
        scope: {
            data: "=data",
            type: "=type",
            name: "=name"
        },
        template:
        "<div class='col-sm-2 col-xs-6'>" +
        "       <span class='pull-right '>{{data}}%</span>" +
        "       <span>{{name}}</span>" +
        "       <progressbar min='0' max='100' value='data' class='progress-xs m-t-sm bg-white' animate='true' type='{{type}}'></progressbar>" +
        "</div>"

    }
})
;