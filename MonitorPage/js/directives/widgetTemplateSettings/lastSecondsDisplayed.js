angular.module('app').directive('lastSecondsDisplayed', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        "<div class='form-group '>" +
        "   <label class='col-sm-3 col-md-3 col-xs-4 control-label text-right-xs'>Last seconds displayed:</label>" +
        "       <div class='col-sm-4 col-md-4 col-xs-8'>" +
        "           <input  ui-jq='TouchSpin' ng-model='widget.options.options.scales.xAxes[0].ticks.max' type ='number' class='form-control' data-min='60' data-max='200' data-verticalbuttons='false'  data-postfix='secs'>" +
        "       </div>" +
        "</div>"

    }
})
;