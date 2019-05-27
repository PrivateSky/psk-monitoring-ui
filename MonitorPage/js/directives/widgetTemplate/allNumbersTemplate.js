angular.module('app').directive('allNumbersTemplate', function () {
    return {
        restrict: 'EA',
        scope: {
            widget: "=model"
        },
        template:
        "<div class=' padder row row-sm text-center m-t-md'>" +
        "   <div class='col-xs-6'>" +
        "       <div class='panel padder-v bg-success lter item'>" +
        "           <div class='h1 text-white font-thin'>{{widget.options.data.adaptersNumber}}</div>" +
        "           <span class='text-white text-xs'>Adapters</span>" +
        "           <div class='top text-right w-full'>" +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "<div class='col-xs-6'>" +
        "   <div class='block panel padder-v bg-primary item'>" +
        "       <span class='text-white font-thin h1 block'>{{widget.options.data.errorsNumber}}</span>" +
        "       <span class='text-white text-xs'>Errors Logs</span>" +
        "       <span class='bottom text-right w-full'>" +
        "       </span>" +
        "   </div>" +
        "</div>" +
        "<div class='col-xs-6'>" +
        "   <div class='block panel padder-v bg-info item'>" +
        "       <span class='text-white font-thin h1 block'>{{widget.options.data.reloadingAdaptersNumber}}</span>" +
        "       <span class='text-white text-xs'>Nr adapters restarted</span>" +
        "       <span class='top text-left'>" +
        "       </span>" +
        "   </div>" +
        "</div>" +
        "<div class='col-xs-6'>" +
        "   <div class='panel padder-v  bg-danger lt item'>" +
        "       <div class='font-thin h1'>{{widget.options.data.swarmsNumber}}</div>" +
        "           <span class='text-white text-xs'>Swarms</span>" +
        "           <div class='bottom text-left'>" +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "</div>"

    };
});