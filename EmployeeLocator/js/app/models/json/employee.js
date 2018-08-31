define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),

        Employee = Backbone.Model.extend({

            urlRoot: "http://localhost:65495/Data/FindPersonOrLocationResult",

            initialize: function () {
                this.reports = new EmployeeCollection();
                this.reports.url = this.urlRoot + "/" + this.id + "/reports";
            }

        }),

        EmployeeCollection = Backbone.Collection.extend({

            model: Employee,

            url: "http://localhost:65495/employees"

        });

    return {
        Employee: Employee,
        EmployeeCollection: EmployeeCollection
    };

});