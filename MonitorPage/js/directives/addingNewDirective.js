angular.module('app').directive('addingNewDirective', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, element, attributes) {
            scope.$watch(attributes.addingNewDirective, function (html) {
                element.html("<div " + html + " model='widget'></div>");
                $compile(element.contents())(scope);
            });
        }
    };
});