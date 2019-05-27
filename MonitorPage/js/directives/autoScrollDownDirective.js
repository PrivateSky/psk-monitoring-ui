/**
 * @author Dorneanu Dragos-Andrei(dragos.a.dorneanu@gmail.com) on 9/20/17
 */
angular.module('app')
    .directive('autoScrollDown', function () {
        return {
            link: function (scope, element) {
                scope.$watch(function () {
                    return element[0].scrollHeight;
                }, function (newHeight, oldHeight) {
                    if (element[0].scrollTop + element[0].offsetHeight >= oldHeight) {
                        element[0].scrollTop = element[0].scrollHeight;
                    }
                }, true);
            }
        };
    });
