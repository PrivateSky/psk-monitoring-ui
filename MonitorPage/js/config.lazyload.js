angular.module('app')
/**
 * jQuery plugin config use ui-jq directive, config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
    .constant('JQ_CONFIG', {
        easyPieChart: ['../angulr-theme/vendor/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
        slimScroll: ['../angulr-theme/vendor/jquery/slimscroll/jquery.slimscroll.min.js'],
        sparkline: ['../angulr-theme/vendor/jquery/charts/sparkline/jquery.sparkline.min.js'],
        sortable: ['../angulr-theme/vendor/jquery/sortable/jquery.sortable.js'],
        nestable: ['../angulr-theme/vendor/jquery/nestable/jquery.nestable.js', 
            '../angulr-theme/vendor/jquery/nestable/nestable.css'],
        filestyle: ['../angulr-theme/vendor/jquery/file/bootstrap-filestyle.min.js'],
        slider: ['../angulr-theme/vendor/jquery/slider/bootstrap-slider.js',
            '../angulr-theme/vendor/jquery/slider/slider.css'],
        chosen: ['../angulr-theme/vendor/jquery/chosen/chosen.jquery.min.js',
            '../angulr-theme/vendor/jquery/chosen/chosen.css'],
        TouchSpin: ['../angulr-theme/vendor/jquery/spinner/jquery.bootstrap-touchspin.min.js',
            '../angulr-theme/vendor/jquery/spinner/jquery.bootstrap-touchspin.css'],
        wysiwyg: ['../angulr-theme/vendor/jquery/wysiwyg/bootstrap-wysiwyg.js',
            '../angulr-theme/vendor/jquery/wysiwyg/jquery.hotkeys.js'],
        dataTable: ['../angulr-theme/vendor/jquery/datatables/jquery.dataTables.min.js',
            '../angulr-theme/vendor/jquery/datatables/dataTables.bootstrap.js',
            '../angulr-theme/vendor/jquery/datatables/dataTables.bootstrap.css'],
        vectorMap: ['../angulr-theme/vendor/jquery/jvectormap/jquery-jvectormap.min.js',
            '../angulr-theme/vendor/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
            '../angulr-theme/vendor/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
            '../angulr-theme/vendor/jquery/jvectormap/jquery-jvectormap.css'],
        footable: ['../angulr-theme/vendor/jquery/footable/footable.all.min.js',
            '../angulr-theme/vendor/jquery/footable/footable.core.css']
    })
    // oclazyload config
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [
                {
                    name: 'ngGrid',
                    files: [
                        '../angulr-theme/vendor/modules/ng-grid/ng-grid.min.js',
                        '../angulr-theme/vendor/modules/ng-grid/ng-grid.min.css',
                        '../angulr-theme/vendor/modules/ng-grid/theme.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        '../angulr-theme/vendor/modules/angular-ui-select/select.min.js',
                        '../angulr-theme/vendor/modules/angular-ui-select/select.min.css'
                    ]
                },
                {
                    name: 'angularFileUpload',
                    files: [
                        '../angulr-theme/vendor/modules/angular-file-upload/angular-file-upload.min.js'
                    ]
                },
                {
                    name: 'ui.calendar',
                    files: ['../angulr-theme/vendor/modules/angular-ui-calendar/calendar.js']
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        '../angulr-theme/vendor/modules/ngImgCrop/ng-img-crop.js',
                        '../angulr-theme/vendor/modules/ngImgCrop/ng-img-crop.css'
                    ]
                },
                {
                    name: 'angularBootstrapNavTree',
                    files: [
                        '../angulr-theme/vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                        '../angulr-theme/vendor/modules/angular-bootstrap-nav-tree/abn_tree.css'
                    ]
                },
                {
                    name: 'toaster',
                    files: [
                        '../angulr-theme/vendor/modules/angularjs-toaster/toaster.js',
                        '../angulr-theme/vendor/modules/angularjs-toaster/toaster.css'
                    ]
                },
                {
                    name: 'textAngular',
                    files: [
                        '../angulr-theme/vendor/modules/textAngular/textAngular-sanitize.min.js',
                        '../angulr-theme/vendor/modules/textAngular/textAngular.min.js'
                    ]
                },
                {
                    name: 'vr.directives.slider',
                    files: [
                        '../angulr-theme/vendor/modules/angular-slider/angular-slider.min.js',
                        '../angulr-theme/vendor/modules/angular-slider/angular-slider.css'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/videogular.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.controls',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/plugins/controls.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.buffering',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/plugins/buffering.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.overlayplay',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/plugins/overlay-play.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.poster',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/plugins/poster.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.imaads',
                    files: [
                        '../angulr-theme/vendor/modules/videogular/plugins/ima-ads.min.js'
                    ]
                }
            ]
        });
    }]);