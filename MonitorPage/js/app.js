angular.module('app', [
    'chart.js',
    'ngMaterial',
    'ui.router',
    'ngAnimate',
    'ui.sortable',
    'ui.load',
    'ui.jq',
    'nvd3',
    'oc.lazyLoad',
    'material.components.expansionPanels',
    'swarm',
    'infinite-scroll',
    'angularMoment',
    'ui.bootstrap'
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/defaultPage');

    $stateProvider
        .state('defaultPage', {
            url: '/defaultPage',
            controller: 'dashboardControl',
            templateUrl: 'tpl/dashboardPage.html'
        })
        .state('logsPage', {
            url: '/logsPage',
            controller: 'logsController',
            templateUrl: 'tpl/logsPage.html'
        })
        .state('consolePage', {
            url: '/consolePage',
            controller: 'logsConsoleController',
            templateUrl: 'tpl/consolePage.html'
        })
        .state('notificationsPage', {
            url: '/notificationsPage',
            controller: 'notificationControl',
            templateUrl: 'tpl/notificationsPage.html'
        })
        .state('settingsPage', {
            url: '/settingsPage',
            templateUrl: 'tpl/settingsPage.html'
        });
});