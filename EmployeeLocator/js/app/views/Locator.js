define(function (require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/Locator.html'),
        Two = require('two'),
        template = _.template(tpl);

    return Backbone.View.extend({

        render: function () {
            this.$el.html(template());
            $('img[id="imgfloorplan"]').on('load', _.bind(this._imageLoaded, this));
            return this;
        },

        initialize: function () {
            this._colors = { Turquoise: '#1abc9c', GreenSea: '#16a085', Emerald: '#2ecc71', Nephritis: '#27ae60', PeterRiver: '#3498db', BelizeHole: '#2980b9', Amethyst: '#9b59b6', Wisteria: '#8e44ad', WetAsphalt: '#34495e', MidnightBlue: '#2c3e50', Sunflower: '#f1c40f', Orange: '#f39c12', Carrot: '#e67e22', Pumpkin: '#d35400', Sunred: '#e74c3c', SoftPink: '#f02075' };
            this._imageDimensions = {
                waverock: {
                    phaseI: { width: 3701, height: 2929 },
                    phaseII: {
                        width: 3861, height: 1621,
                        path: [
                            { from: { width: 220, height: 1115 }, to: { width: 220, height: 1480 } }, //teja to sup
                            { from: { width: 400, height: 1115 }, to: { width: 400, height: 1480 } }, //sud to x
                            { from: { width: 620, height: 1115 }, to: { width: 620, height: 1480 } }, //chand to y
                            { from: { width: 220, height: 1480 }, to: { width: 620, height: 1480 } }, //sup to y
                            { from: { width: 220, height: 1115 }, to: { width: 620, height: 1115 } }, //teja to chand
                            { from: { width: 620, height: 1115 }, to: { width: 800, height: 1115 } }, //chand to door
                            { from: { width: 800, height: 1115 }, to: { width: 2120, height: 1115 } }, //door to turn
                            { from: { width: 2120, height: 1115 }, to: { width: 2120, height: 925 } }, //turn to red
                            { from: { width: 2120, height: 925 }, to: { width: 3105, height: 925 } }, //red to recd2
                            { from: { width: 3105, height: 925 }, to: { width: 3705, height: 925 } } //recd2 to recd1
                        ]
                    }
                }
            };
            this._employeeList = [{ empId: 1, name: 'Supraja', width: 265, height: 1416 }, { empId: 2, name: 'Hajera', width: 3507, height: 1110 }];
        },

        _imageLoaded: function (shape) {
            var self = this;
            var elem = document.getElementById('floorplan');
            var params = { fullscreen: false, autostart: true };

            this._two = new Two(params).appendTo(elem);
            this._group = new Two.Group();

            this._resize(this);
            window.addEventListener('resize', _.bind(this._resize, this), false);

            this._two//.bind('resize', _.bind(this._resize, this))
               .bind('update', function (frameCount) {

               }).play();
            //this._two.update();
        },

        _resize: function (x, y) {
            this._destroyAll();
            this._setRendererSize();
            var image = this._getImage();
            var rv = this._getResponsiveValue(image.width), rvpx = (rv * 10), r = (rvpx / 2);
            var source = this._findEmployee(1);
            var destination = this._findEmployee(2);
            this._buildPath(this._imageDimensions.waverock.phaseII.path, source, destination);
            //this._drawCurve(this._drawPoint(source.width, source.height), this._drawPoint(destination.width, destination.height), 'transparent', this._colors.PeterRiver);
            //this._drawLine(source.width, source.height, destination.width, destination.height, 'transparent', this._colors.PeterRiver);
            this._drawCircle(source.width, source.height, (r - rv), this._colors.Emerald, this._colors.Emerald);
            this._insertText(source.name, source.width, (image.height - source.height) > 100 ? source.height + r : source.height - r, this._colors.SoftPink);
            this._drawCircle(destination.width, destination.height, (r - rv), this._colors.Sunred, this._colors.Sunred);
            this._insertText(destination.name, destination.width, (image.height - destination.height) > 100 ? destination.height + r : destination.height - r, this._colors.SoftPink);
            this._two.add(this._group);
            this._two.update();
            //this._group.translation.set(this._two.width / 2, this._two.height / 2);
        },

        _buildPath: function (paths, source, destination) {
            var self = this;
            //var choosenPath = [];
            //var closest = null;
            //Two.Utils.each(paths, function (path, index, parent) {
            //    var bidirectionalPath = []; bidirectionalPath.push(path.from); bidirectionalPath.push(path.to);
            //    Two.Utils.each(bidirectionalPath, function (bipath, index, parent) {
            //        if (closest == null || Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) {
            //            choosenPath.push(bipath);
            //            closest = bipath;
            //            //console.log('x:');
            //            //console.log(closest);
            //        }
            //        if (closest == null || Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)) {
            //            choosenPath.push(bipath);
            //            closest = bipath;
            //            //console.log('y:');
            //            //console.log(closest);
            //        }
            //    });
            //});
            //var previousPath = null;
            //Two.Utils.each(choosenPath, function (path, index, parent) {
            //    var rpath = self._rePositionShape(path), from = null, to = null;
            //    if (index == 0) {
            //        from = source;
            //        to = rpath;
            //    }
            //    else if (index == (choosenPath.length - 1)) {
            //        from = rpath;
            //        to = destination;
            //    }
            //    else {
            //        from = previousPath;
            //        to = rpath;
            //    }
            //    var totalPath = self._generateInBetweenPath(from, to);
            //    console.log(totalPath);
            //    self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
            //    previousPath = rpath;
            //});
            //self._two.update();

            //---------------------

            var closest = null, choosenPath = [], previousPath = null, bidirPaths = [];
            Two.Utils.each(paths, function (path, index, parent) {
                bidirPaths.push(self._rePositionShape(path.from));
                bidirPaths.push(self._rePositionShape(path.to));
            });
            choosenPath = this._closestPath(bidirPaths, source, destination);
            Two.Utils.each(choosenPath, function (path, index, parent) {
                var from = null, to = null;
                if (index == 0) {
                    from = source;
                    to = path;
                }
                else if (index == (choosenPath.length - 1)) {
                    from = path;
                    to = destination;
                }
                else {
                    from = previousPath;
                    to = path;
                }
                //bidirPaths = bidirPaths.concat(self._generateInBetweenPath(from, to));
                self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
                previousPath = path;
            });
        },

        _removeDuplicates: function (arrayList) {
            return _.collect(_.uniq(_.collect(arrayList, function (x) { return JSON.stringify(x); })), function (x) { return JSON.parse(x); });
        },

        _generateInBetweenPath: function (from, to) {
            if (from.width === to.width) {
                return Array.apply(0, new Array(parseInt(Math.abs(from.height - to.height)))).map(function (_, i) { return { width: from.width, height: i + (from.height < to.height ? from.height : to.height) }; });
            }
            else if (from.height === to.height) {
                return Array.apply(0, new Array(parseInt(Math.abs(from.width - to.width)))).map(function (_, i) { return { width: i + (from.width < to.width ? from.width : to.width), height: from.height }; });
            }
            else {
                return Array.apply(0, new Array(1)).map(function (_, i) { return Math.abs(from.width - to.width) < Math.abs(from.height - to.height) ? { width: from.width < to.width ? to.width - from.width : from.width - to.width, height: from.height } : { width: from.width, height: from.height < to.height ? to.height - from.height : from.height - to.height }; });
            }
        },

        _closestPath: function (availPaths, source, destination) {
            var choosenPath = [], closest = null;
            Two.Utils.each(availPaths, function (bipath, index, parent) {
                if (index !== 0) {
                    console.log('[width] ' + Math.abs(bipath.width - destination.width) + ' < ' + Math.abs(closest.width - destination.width) + ' : ' + (Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) + ' [height] ' + Math.abs(bipath.height - destination.height) + ' < ' + Math.abs(closest.height - destination.height) + ' : ' + (Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)));
                }
                if (closest == null || Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) {
                    choosenPath.push(bipath);
                    closest = bipath;
                }
                if (closest == null || Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)) {
                    choosenPath.push(bipath);
                    closest = bipath;
                }
            });
            return this._removeDuplicates(choosenPath);
        },

        _closest: function () {
            var theArray = [1, 3, 8, 10, 13];
            var goal = 4;
            var closest = null;

            $.each(theArray, function () {
                if (closest == null || Math.abs(this - goal) < Math.abs(closest - goal)) {
                    closest = this;
                }
            });
        },

        _destroyAll: function () {
            var self = this;
            Two.Utils.each(this._group.children, function (child, a, i) {
                self._group.children.splice(child, 1);
            });
            Two.Utils.each(this._two.scene.children, function (child, a, i) {
                self._two.scene.children.splice(child, 1);
            });
            this._two.update();
        },

        _getImage: function () {
            return _.first($('img[id="imgfloorplan"]'));
        },

        _setLineWidth: function (line) {
            var image = this._getImage();
            line.linewidth = this._getResponsiveValue(image.width);
        },

        _getResponsiveValue: function (width) {
            return width > 1200 ? 5 : width > 992 ? 4 : width > 768 ? 3 : width > 568 ? 2 : 1;
        },

        _setRendererSize: function () {
            var image = this._getImage();
            this._two.width = image.width;
            this._two.height = image.height;
            this._two.renderer.setSize(image.width, image.height);
        },

        _findEmployee: function (employeeId) {
            var employee = _.clone(_.first(_.filter(this._employeeList, function (emp) { return emp.empId === employeeId; })));
            var rePositioned = this._rePositionShape(employee);
            _.extend(employee, rePositioned);
            return employee;
        },

        _rePositionShape: function (shape) {
            var image = this._getImage();
            return {
                width: (image.width * shape.width) / this._imageDimensions.waverock.phaseII.width,
                height: (image.height * shape.height) / this._imageDimensions.waverock.phaseII.height
            };
        },

        _addToGroup: function (shape) {
            this._group.add(shape);
        },

        _insertText: function (message, x, y, fill, stroke, styles) {
            var text = new Two.Text(message, x, y, styles);
            if (fill) text.fill = fill;
            if (stroke) text.stroke = stroke;
            text.linewidth = 1;
            this._addToGroup(text);
        },

        _drawPoint: function (x, y) {
            var vector = new Two.Vector(x, y);
            vector.position = new Two.Vector().copy(vector);
            return vector;
        },

        _drawLine: function (sx, sy, dx, dy, fill, stroke) {
            var line = this._two.makeLine(sx, sy, dx, dy);
            if (!fill) {
                line.noFill();
            }
            line.fill = fill;
            line.stroke = stroke;
            line.cap = 'round';
            line.opacity = 0.8;
            this._setLineWidth(line);
            this._addToGroup(line);
        },

        _drawCurve: function (vector1, vector2, fill, stroke) {
            var curve = this._two.makeCurve([vector1, vector2], true);
            if (!fill) {
                curve.noFill();
            }
            curve.fill = fill;
            curve.stroke = stroke;
            curve.opacity = 0.6;
            this._setLineWidth(curve);
            _.each(curve.vertices, function (v) {
                v.addSelf(curve.translation);
            });
            curve.translation.clear();
            this._addToGroup(curve);
        },

        _drawCircle: function (x, y, r, fill, stroke) {
            var circle = new Two.Circle(x, y, r);
            if (!fill) {
                circle.noFill();
            }
            circle.fill = fill;
            circle.stroke = stroke;
            circle.opacity = 0.4;
            this._setLineWidth(circle);
            this._addToGroup(circle);
        },

        _setEnding: function (group, t) {
            var i = 0;
            var traversed = t * group.total;
            var current = 0;

            _.each(group.children, function (child) {
                var distance = group.distances[i];
                var min = current;
                var max = current + distance;
                var pct = cmap(traversed, min, max, 0, 1);
                child.ending = pct;
                current = max;
                i++;
            });
        },

        _calculateDistance: function (shape) {
            var d = 0,
                a;
            _.each(shape.vertices, function (b, i) {
                if (i > 0) {
                    d += a.distanceTo(b);
                }
                a = b;
            });
            return d;
        },

        _calculateDistances: function (group) {
            return _.map(group.children, function (child) {
                var d = 0, a;
                _.each(child.vertices, function (b, i) {
                    if (i > 0) {
                        d += a.distanceTo(b);
                    }
                    a = b;
                });
                return d;
            });
        },

        _clamp: function (v, min, max) {
            return Math.max(Math.min(v, max), min);
        },

        _map: function (v, i1, i2, o1, o2) {
            return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
        },

        _cmap: function (v, i1, i2, o1, o2) {
            return this._clamp(this._map(v, i1, i2, o1, o2), o1, o2);
        }
    });
});