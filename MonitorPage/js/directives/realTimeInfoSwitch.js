angular.module('app').directive('realTimeInfoSwitch', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        '<div ng-if="widget.options.liveInfo!=undefined">' +
        '   <div class="form-group" >' +
        '                    <label class="col-sm-3 col-md-3 col-xs-6 control-label text-right-xs ">Live information</label>' +
        '                    <div class="col-sm-2 col-xs-4">' +
        '                        <label class="i-switch m-t-xs m-r">' +
        '                            <input type="checkbox" ng-model="widget.options.liveInfo" ng-change="realTimeInfo()"> <i></i>' +
        '                        </label>' +
        '                    </div>' +
        '  </div>' +
        '<div class="line line-dashed b-b line-lg pull-in"></div>'+
        '</div>'
    }
});
