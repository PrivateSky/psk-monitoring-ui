angular.module('app').directive('customizingControls', function () {
    return {
        restrict: 'E',
        scope: false,
        template:
        '<div  class="btn-toolbar">' +
        '    <div class="btn-group">' +
        '        <span  class="btn btn-default drag-handle"  title="Drag&Drop">' +
        '               <i class="fa fa-arrows"></i>' +
        '        </span>' +
        '        <button type="button" class="btn btn-default " name="Resize widget" ng-click="resizeWidget(widget)"' +
        '               title="Resize widget"><i class="fa fa-expand"></i>' +
        '        </button>' +
        '        <button type="button" class="btn btn-default" name="Delete Widget"  ng-click="deleteWidget({index:index})"' +
        '                title="Delete Widget"><i class="fa fa-times "></i>' +
        '        </button><button class="btn btn-default" ng-click="showSettings()"><i' +
        '                class="fa fa-gear"></i></button>' +
        '    </div>  ' +
        '</div>'

    };

});