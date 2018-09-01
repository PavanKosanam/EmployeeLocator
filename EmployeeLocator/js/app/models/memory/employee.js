define(function (require) {

    "use strict";

    var $ = require('jquery'),
        Backbone = require('backbone'),

        employees = [
            {
                "id": 1, "firstName": "Shyam", "lastName": "Palreddy", "managerId": 0, "managerName": "", "reports": 4, "title": "President and CEO", "department": "Corporate", "cellPhone": "+91-9864584581", "officePhone": "+91-7864584581", "email": "spalreddy@testmail.com", "city": "Boston, MA", "pic": "shyam_palreddy.jpg", "twitterId": "@testjPalreddy", "blog": "hello.com"
            },
            {
                "id": 2, "firstName": "Julie", "lastName": "Taylor", "managerId": 1, "managerName": "Shyam Palreddy", "reports": 2, "title": "VP of Marketing", "department": "Marketing", "cellPhone": "+91-9864584582", "officePhone": "+91-7864584582", "email": "jtaylor@testmail.com", "city": "Boston, MA", "pic": "julie_taylor.jpg", "twitterId": "@testjtaylor", "blog": "hello.com"
            },
            {
                "id": 3, "firstName": "Eugene", "lastName": "Lee", "managerId": 1, "managerName": "Shyam Palreddy", "reports": 0, "title": "CFO", "department": "Accounting", "cellPhone": "+91-9864584583", "officePhone": "+91-7864584583", "email": "elee@testmail.com", "city": "Boston, MA", "pic": "eugene_lee.jpg", "twitterId": "@testelee", "blog": "hello.com"
            },
            {
                "id": 4, "firstName": "John", "lastName": "Williams", "managerId": 1, "managerName": "Shyam Palreddy", "reports": 3, "title": "VP of Engineering", "department": "Engineering", "cellPhone": "+91-9017867864", "officePhone": "+91-7817867864", "email": "jwilliams@testmail.com", "city": "Boston, MA", "pic": "john_williams.jpg", "twitterId": "@testjwilliams", "blog": "hello.com"
            },
            {
                "id": 5, "firstName": "Ray", "lastName": "Moore", "managerId": 1, "managerName": "Shyam Palreddy", "reports": 2, "title": "VP of Sales", "department": "Sales", "cellPhone": "+91-9017867865", "officePhone": "+91-7817867865", "email": "rmoore@testmail.com", "city": "Boston, MA", "pic": "ray_moore.jpg", "twitterId": "@testrmoore", "blog": "hello.com"
            },
            {
                "id": 6, "firstName": "Paul", "lastName": "Jones", "managerId": 4, "managerName": "John Williams", "reports": 0, "title": "QA Manager", "department": "Engineering", "cellPhone": "+91-9017867866", "officePhone": "+91-7817867866", "email": "pjones@testmail.com", "city": "Boston, MA", "pic": "paul_jones.jpg", "twitterId": "@testpjones", "blog": "hello.com"
            },
            {
                "id": 7, "firstName": "Paula", "lastName": "Gates", "managerId": 4, "managerName": "John Williams", "reports": 0, "title": "Software Architect", "department": "Engineering", "cellPhone": "+91-9449659657", "officePhone": "+91-8179659657", "email": "pgates@testmail.com", "city": "Boston, MA", "pic": "paula_gates.jpg", "twitterId": "@testpgates", "blog": "hello.com"
            },
            {
                "id": 8, "firstName": "Lisa", "lastName": "Wong", "managerId": 2, "managerName": "Julie Taylor", "reports": 0, "title": "Marketing Manager", "department": "Marketing", "cellPhone": "+91-9449659658", "officePhone": "+91-8179659658", "email": "lwong@testmail.com", "city": "Boston, MA", "pic": "lisa_wong.jpg", "twitterId": "@testlwong", "blog": "hello.com"
            },
            {
                "id": 9, "firstName": "Gary", "lastName": "Donovan", "managerId": 2, "managerName": "Julie Taylor", "reports": 0, "title": "Marketing Manager", "department": "Marketing", "cellPhone": "+91-9449659659", "officePhone": "+91-8179659659", "email": "gdonovan@testmail.com", "city": "Boston, MA", "pic": "gary_donovan.jpg", "twitterId": "@testgdonovan", "blog": "hello.com"
            },
            {
                "id": 10, "firstName": "Kathleen", "lastName": "Byrne", "managerId": 5, "managerName": "Ray Moore", "reports": 0, "title": "Sales Representative", "department": "Sales", "cellPhone": "+91-7668430010", "officePhone": "+91-7818430010", "email": "kbyrne@testmail.com", "city": "Boston, MA", "pic": "kathleen_byrne.jpg", "twitterId": "@testkbyrne", "blog": "hello.com"
            },
            {
                "id": 11, "firstName": "Amy", "lastName": "Jones", "managerId": 5, "managerName": "Ray Moore", "reports": 0, "title": "Sales Representative", "department": "Sales", "cellPhone": "+91-7668430011", "officePhone": "+91-7818430011", "email": "ajones@testmail.com", "city": "Boston, MA", "pic": "amy_jones.jpg", "twitterId": "@testajones", "blog": "hello.com"
            },
            {
                "id": 12, "firstName": "Steven", "lastName": "Wells", "managerId": 4, "managerName": "John Williams", "reports": 0, "title": "Software Architect", "department": "Engineering", "cellPhone": "+91-7668430012", "officePhone": "+91-7818430012", "email": "swells@testmail.com", "city": "Boston, MA", "pic": "steven_wells.jpg", "twitterId": "@testswells", "blog": "hello.com"
            }
        ],

        findById = function (id) {
            var employees = [];

            var deferred = $.Deferred(),
                employee = null,
                l = employees.length,
                i;

            $.ajax({
                dataType: "json",
                url: "/Data/FindPersonOrLocationById",
                data: { Id: id },
                success: function (response) {
                    $.each(response.Data, function (i, x) {
                        employees.push(createEmployeeModel(x));
                    });
                    l = employees.length;
                    for (i = 0; i < l; i = i + 1) {
                        if (employees[i].id === id) {
                            employee = employees[i];
                            break;
                        }
                    }
                    deferred.resolve(employee);
                }
            });
            return deferred.promise();
        },

        urlExists = function (url) {
            var http = new XMLHttpRequest();
            try {
                http.open('HEAD', url+'.jpg', false);
                http.send();
            } catch (e) {
            }
            return http.status != 404;
        },

        createEmployeeModel = function (x) {
            var fn = x.FirstName ? x.FirstName.toLowerCase().replace(/[^A-Z0-9]+/ig, '') : null, ln = x.LastName ? x.LastName.toLowerCase().replace(/[^A-Z0-9]+/ig, '') : null;
            var pic = fn ? urlExists('/pics/' + fn + '_' + ln) ? fn + '_' + ln : (x.FirstName.endsWith('a') || x.FirstName.endsWith('i')) ? 'roja_mule' : 'pavan_kosanam' : 'Meeting';
            return {
                id: x.ID,
                name: x.Name,
                firstName: x.FirstName,
                lastName: x.LastName,
                managerId: x.ManagerID,
                managerName: x.ManagerName,
                reports: x.Reports,
                title: x.Title,
                department: x.Department,
                cellPhone: x.CellPhone,
                officePhone: x.OfficePhone,
                email: x.EmailID,
                city: x.City,
                pic: pic,
                twitterId: x.TwitterID,
                blog: x.Blog,
                width: x.X_Value,
                height: x.Y_Value
            };
        },

        findByName = function (searchKey) {
            var deferred = $.Deferred(), results;
            $.ajax({
                dataType: "json",
                url: "/Data/FindPersonOrLocationResult",
                data: { searchTerm: searchKey },
                success: function (response) {
                    results = [];
                    $.each(response.Data, function (i, x) {
                        results.push(createEmployeeModel(x));
                    });
                    deferred.resolve(results);
                }
            });
            return deferred.promise();
        },

        findByName = function (searchKey) {
            var deferred = $.Deferred(), results;
            $.ajax({
                dataType: "json",
                url: "/Data/FindPersonOrLocationResult",
                data: { searchTerm: searchKey },
                success: function (response) {
                    results = [];
                    $.each(response.Data, function (i, x) {
                        results.push(createEmployeeModel(x));
                    });
                    deferred.resolve(results);
                }
            });
            return deferred.promise();
        },

        findByManager = function (managerId) {
            var deferred = $.Deferred(),
                results = employees.filter(function (element) {
                    return managerId === element.managerId;
                });
            deferred.resolve(results);
            return deferred.promise();
        },


        Employee = Backbone.Model.extend({

            initialize: function () {
                this.reports = new ReportsCollection();
                this.reports.parent = this;
            },

            sync: function (method, model, options) {
                if (method === "read") {
                    findById(parseInt(this.id)).done(function (data) {
                        options.success(data);
                    });
                }
            }

        }),

        EmployeeCollection = Backbone.Collection.extend({

            model: Employee,

            sync: function (method, model, options) {
                if (method === "read") {
                    findByName(options.data.name).done(function (data) {
                        options.success(data);
                    });
                }
            }

        }),

        ReportsCollection = Backbone.Collection.extend({

            model: Employee,

            sync: function (method, model, options) {
                if (method === "read") {
                    findByManager(this.parent.id).done(function (data) {
                        options.success(data);
                    });
                }
            }

        });

    return {
        Employee: Employee,
        EmployeeCollection: EmployeeCollection,
        ReportsCollection: ReportsCollection
    };

});