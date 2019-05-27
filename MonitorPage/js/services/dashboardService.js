angular.module('app')
    .service('dashboardService', ['swarmHubService', 'notifyDefaults', function (swarmHubService, notifyDefaults) {
        $.notifyDefaults(notifyDefaults);

        const hub = swarmHubService.hub;
        let defaultDashboard = null;
        const orderedWidgets = {};

        // hub.on("dashboardSwarm.js", "error", function (swarm) {
        //     $.notify({
        //         icon: 'glyphicon glyphicon-warning-sign',
        //         message: swarm.error
        //     }, {
        //         type: 'danger'
        //     });
        // });

        const saveModel = function (template) {
            for (let i in template.widgets) {
                let freshWidget = orderedWidgets[template.widgets[i].name];
                for (let j in freshWidget.options) {
                    if (j === 'options') {
                        for (let h in freshWidget.options[j]) {
                            freshWidget.options[j][h] = template.widgets[i].options[j][h];
                        }
                    } else {
                        freshWidget.options[j] = template.widgets[i].options[j];
                    }
                }
                freshWidget["swarm-arguments"] = template.widgets[i]["swarm-arguments"];
                template.widgets[i] = freshWidget;
            }
            return template;
        };

        const orderWidgets = function (widgets) {
            for (let i in widgets) {
                orderedWidgets[widgets[i].name] = widgets[i];
            }
        };

        return {
            getUserDashboard: function (callback) {
                hub.startSwarm('dashboardSwarm', 'getUserDashboard', {}).onReturn((template) => {
                   callback(template);
                });

                // hub.on("dashboardSwarm.js", "UserDashboard", function (swarm) {
                //     callback(swarm.template);
                // });
                // hub.startSwarm("dashboardSwarm.js", "getUserDashboard", {});
            },
            saveDashboard: function (template, callback) {
                // hub.on("dashboardSwarm.js", "savedDashboard", function (swarm) {
                //     $.notify({
                //         icon: 'glyphicon glyphicon-saved',
                //         message: "Dashboard saved"
                //     }, {
                //         type: 'success'
                //     });
                //     callback(swarm.dashboard);
                //     hub.off("dashboardSwarm.js", "savedDashboard", function () {
                //     });
                // });

                template = JSON.parse(JSON.stringify(template));
                template = saveModel(template);
                hub.startSwarm("dashboardSwarm", "saveDashboard", template).onReturn((dashboard) => {
                    $.notify({
                        icon: 'glyphicon glyphicon-saved',
                        message: "Dashboard saved"
                    }, {
                        type: 'success'
                    });
                    callback(dashboard);
                });

            },
            getDefaultDashboardWidgets: function (callback) {
                if (!defaultDashboard) {
                    // hub.on("dashboardSwarm.js", "DefaultDashboard", function (swarm) {
                    //     defaultDashboard = swarm.template;
                    //     callback(swarm.template.widgets);
                    //     orderWidgets(JSON.parse(JSON.stringify(swarm.template.widgets)));
                    // });
                    // hub.startSwarm("dashboardSwarm.js", "getDefaultDashboard", {});
                    hub.startSwarm("dashboardSwarm", "getDefaultDashboard", {}).onReturn(template => {
                        defaultDashboard = template;
                        callback(template.widgets);
                        orderWidgets(JSON.parse(JSON.stringify(template.widgets)));
                    })
                }
                else {
                    callback(defaultDashboard.widgets);
                }
            },
            restoreDefaultDashboard: function (callback) {
                // hub.on("dashboardSwarm.js", "DefaultDashboard", function (swarm) {
                //     defaultDashboard = swarm.template;
                //     callback(swarm.template);
                // });
                // hub.startSwarm("dashboardSwarm.js", "getDefaultDashboard", {});
                hub.startSwarm("dashboardSwarm", "getDefaultDashboard", {}).onReturn(template => {
                    defaultDashboard = template;
                    callback(template);
                });
            }
        }
    }]);
