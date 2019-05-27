angular.module('app')
    .constant('notifyDefaults', {
        placement: {
            from: "bottom",
            align: "right"
        },
        animate: {
            enter: "animated fadeInDown",
            exit: "animated fadeOutUp"
        },
        allow_dismiss: true,
        element: 'body',
        timer: 1000,
        delay: 3000,
        offset: {
            y: 10,
            x: 0
        }
    })
    .constant('widgetsInfo', {
        DISPLAYED_WIDGETS_NUMBER: 2,
        SIZE: {
            'small': 'col-md-6',
            'big': 'col-md-12'
        }
    })
    .constant('pageStates', {
        EDITING: "editing",
        PREVIEW: "preview"
    })
    .constant('logsPageConstants', {
        PAGES_SET_SIZE: 5,
        PAGE_SIZE: 10,
        MAX_INFO_SIZE: 50
    })
    .constant('logsConsoleConstants', {
        ONE_MINUTE: 60000,
        CONSOLE_LOGS_DIVIDER: "\n=================================\n\n"
    });
