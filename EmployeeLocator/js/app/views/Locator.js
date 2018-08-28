define(function (require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/Locator.html'),
        loc = require('text!../../../img/location.svg'),
        Two = require('two'),
        template = _.template(tpl);

    return Backbone.View.extend({

        render: function () {
            this.$el.html(template());
            $('img[id="imgfloorplan"]').on('load', _.bind(this._imageLoaded, this));
            return this;
        },

        initialize: function () {
            this._colors = { Turquoise: '#1abc9c', GreenSea: '#16a085', Emerald: '#2ecc71', Nephritis: '#27ae60', PeterRiver: '#3498db', BelizeHole: '#2980b9', Amethyst: '#9b59b6', Wisteria: '#8e44ad', WetAsphalt: '#34495e', MidnightBlue: '#2c3e50', Sunflower: '#f1c40f', Orange: '#f39c12', Carrot: '#e67e22', Pumpkin: '#d35400', Sunred: '#e74c3c', SoftPink: '#f02075', GgkOrange: '#D35106', GgkBlue: '#00628b' };
            this._imageDimensions = {
                waverock: {
                    phaseI: { width: 3701, height: 2929 },
                    phaseII: {
                        width: 3861, height: 1621,
                        path: [
                            { from: { width: 220, height: 1115 }, to: { width: 220, height: 1480 }, place: 'teja to sup' }, //teja to sup
                            { from: { width: 400, height: 1115 }, to: { width: 400, height: 1480 }, place: 'sud to x' }, //sud to x
                            { from: { width: 620, height: 1115 }, to: { width: 620, height: 1480 }, place: 'chand to srin' }, //chand to srin
                            { from: { width: 220, height: 1480 }, to: { width: 620, height: 1480 }, place: 'sup to srin' }, //sup to srin
                            { from: { width: 220, height: 1115 }, to: { width: 620, height: 1115 }, place: 'teja to chand' }, //teja to chand
                            { from: { width: 620, height: 1115 }, to: { width: 800, height: 1115 }, place: 'chand to door' }, //chand to door
                            { from: { width: 800, height: 1115 }, to: { width: 2120, height: 1115 }, place: 'door to turn' }, //door to turn
                            { from: { width: 2120, height: 1115 }, to: { width: 2120, height: 925 }, place: 'turn to redA' }, //turn to redA
                            { from: { width: 2120, height: 925 }, to: { width: 3105, height: 925 }, place: 'redA to recd2' }, //redA to recd2
                            { from: { width: 3105, height: 925 }, to: { width: 3300, height: 925 }, place: 'recd2 to disc' }, //redA to recd2
                            { from: { width: 3300, height: 925 }, to: { width: 3705, height: 925 }, place: 'disc to recd1' } //recd2 to recd1
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
            document.onmousemove = function (e) {
                var x = e.pageX;
                var y = e.pageY;
                //e.target.title = "X is " + x + " and Y is " + y;
                $('#mouseposition').text("pageX: " + e.pageX + " pageY: " + e.pageY + ", clientX: " + e.clientX + " clientY: " + e.clientY + ", screenX: " + e.screenX + " screenY: " + e.screenY + ", x: " + e.x + " y: " + e.y + ", layerX: " + e.layerX + " layerY: " + e.layerY + ", offsetX: " + e.offsetX + " offsetY: " + e.offsetY);
            };
        },

        _resize: function (x, y) {
            var self = this;
            this._destroyAll();
            this._setRendererSize();
            var image = this._getImage();
            var rv = this._getResponsiveValue(image.width), rvpx = (rv * 10), r = (rvpx / 2);
            var source = this._findEmployee(1);
            var destination = this._findEmployee(2);
            var rePosPaths = JSON.parse(JSON.stringify(this._imageDimensions.waverock.phaseII.path));
            Two.Utils.each(rePosPaths, function (path, index, parent) {
                path.from = self._rePositionShape(path.from);
                path.to = self._rePositionShape(path.to);
            });
            this._buildPath(rePosPaths, source, destination);
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

            //var closest = null, choosenPath = [], previousPath = null, bidirPaths = [];
            //Two.Utils.each(paths, function (path, index, parent) {
            //    bidirPaths.push(path.from);
            //    bidirPaths.push(path.to);
            //});
            //choosenPath = this._closestPoint(bidirPaths, source, destination);
            //Two.Utils.each(choosenPath, function (path, index, parent) {
            //    var from = null, to = null, inbtw = null;
            //    if (index == 0) {
            //        from = source;
            //        to = path;
            //    }
            //    else if (index == (choosenPath.length - 1)) {
            //        from = path;
            //        to = destination;
            //    }
            //    else {
            //        from = previousPath;
            //        to = path;
            //    }
            //    if (from.width !== to.width && from.height !== to.height) {
            //        inbtw = self._closest(self._generateInBetweenPath(from, to), from, to);
            //        self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(inbtw.width, inbtw.height), 'transparent', self._colors.PeterRiver);
            //        self._drawCurve(self._drawPoint(inbtw.width, inbtw.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
            //    }
            //    else {
            //        self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
            //    }
            //    previousPath = path;
            //});

            //--------------------------

            var closest = null, choosenPath = [], previousPath = null, bidirPaths = [];
            choosenPath = this._generateClosestPath(paths, source, destination);
            choosenPath = choosenPath.sort(function (a, b) {
                var x = a.closest['width']; var y = b.closest['width'];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            Two.Utils.each(choosenPath, function (path, index, parent) {
                var cpath = path.closest;
                var from = null, to = null, inbtw = null;
                if (index == 0) {
                    from = source;
                    to = cpath;
                }
                else if (index == (choosenPath.length - 1)) {
                    from = cpath;
                    to = destination;
                }
                else {
                    from = previousPath;
                    to = cpath;
                }
                if (from.width !== to.width && from.height !== to.height) {
                    if (index == 0) {
                        var actualclosest = self._closest([path.from, path.to], null, source);
                        if (JSON.stringify(actualclosest) !== JSON.stringify(cpath)) {
                            to = actualclosest;
                        }
                    }
                    else if (index == (choosenPath.length - 1)) {
                        var actualclosest = self._closest([path.from, path.to], null, previousPath);
                        if (JSON.stringify(actualclosest) !== JSON.stringify(cpath)) {
                            from = actualclosest;
                        }
                    }
                    inbtw = self._closest(self._generateInBetweenPath(from, to), from, to);
                    self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(inbtw.width, inbtw.height), 'transparent', self._colors.PeterRiver);
                    self._drawCurve(self._drawPoint(inbtw.width, inbtw.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
                    if (index == 0) {
                        var actualclosest = self._closest([path.from, path.to], null, source);
                        if (JSON.stringify(actualclosest) !== JSON.stringify(cpath)) {
                            self._drawCurve(self._drawPoint(to.width, to.height), self._drawPoint(cpath.width, cpath.height), 'transparent', self._colors.PeterRiver);
                        }
                    }
                    else if (index == (choosenPath.length - 1)) {

                    }
                }
                else {
                    self._drawCurve(self._drawPoint(from.width, from.height), self._drawPoint(to.width, to.height), 'transparent', self._colors.PeterRiver);
                }
                self._two.add(self._group);
                self._two.update();
                previousPath = cpath;
            });
        },

        _removeDuplicates: function (arrayList) {
            return _.collect(_.uniq(_.collect(arrayList, function (x) { return JSON.stringify(x); })), function (x) { return JSON.parse(x); });
        },

        _generateInBetweenPath: function (from, to) {
            var self = this;
            if (from.width === to.width) {
                return Array.apply(0, new Array(parseInt(Math.abs(from.height - to.height)))).map(function (_, i) { return { width: from.width, height: i + (from.height < to.height ? from.height : to.height) }; });
            }
            else if (from.height === to.height) {
                return Array.apply(0, new Array(parseInt(Math.abs(from.width - to.width)))).map(function (_, i) { return { width: i + (from.width < to.width ? from.width : to.width), height: from.height }; });
            }
            else {
                //return Array.apply(0, new Array(1)).map(function (_, i) { return Math.abs(from.width - to.width) < Math.abs(from.height - to.height) ? { width: to.width, height: from.height } : { width: from.width, height: to.height }; });
                var generated = { width: to.width, height: from.height };
                var rePosPaths = JSON.parse(JSON.stringify(this._imageDimensions.waverock.phaseII.path));
                Two.Utils.each(rePosPaths, function (path, index, parent) {
                    path.from = self._rePositionShape(path.from);
                    path.to = self._rePositionShape(path.to);
                });
                var cpath = this._getClosestPath(rePosPaths, generated);
                generated = ((cpath.closest.width === generated.width) || (cpath.closest.height === generated.height)) ? generated : { width: from.width, height: to.height };
                return Array.apply(0, new Array(1)).map(function (_, i) { return generated; });
            }
        },

        _getClosestPath: function (paths, target, checkHeight) {
            var closest = null, closestParent = null, dim = checkHeight ? 'height' : 'width';
            var closestPath = _.first(paths);
            var diff = Math.abs(target[dim] - (closestPath.from ? closestPath.from[dim] : closestPath[dim]));
            Two.Utils.each(paths, function (path, index, parent) {
                Two.Utils.each([path.from, path.to], function (bipath, index, parent) {
                    var newdiff = Math.abs(target[dim] - bipath[dim]);
                    if (newdiff <= diff) {
                        diff = newdiff;
                        closest = bipath;
                        closestParent = parent;
                        closestPath = path;//_.extend(path, { closest: bipath });
                    }
                });
            });

            //var dim = checkHeight ? 'height' : 'width';
            //var closestPath = _.first(paths);
            //var wdiff = Math.abs(target['width'] - (closestPath.from ? closestPath.from['width'] : closestPath['width']));
            //var hdiff = Math.abs(target['height'] - (closestPath.from ? closestPath.from['height'] : closestPath['height']));
            //var closest = closestPath.from ? closestPath.from : closestPath;
            //var closestParent = [closestPath.from, closestPath.to];
            //Two.Utils.each(paths, function (path, index, parent) {
            //    Two.Utils.each([path.from, path.to], function (bipath, index, parent) {
            //        var wnewdiff = Math.abs(target['width'] - bipath['width']);
            //        var hnewdiff = Math.abs(target['height'] - bipath['height']);
            //        if (wnewdiff < wdiff || (wnewdiff <= wdiff && hnewdiff <= hdiff)) { //(wnewdiff < wdiff && hnewdiff <= hdiff) // wnewdiff < wdiff || (hnewdiff < hdiff && hnewdiff < wdiff)
            //            wdiff = wnewdiff;
            //            hdiff = hnewdiff;
            //            closest = bipath;
            //            closestParent = parent;
            //            closestPath = path;//_.extend(path, { closest: bipath });
            //        }
            //    });
            //});

            return { closest: closest, closestParent: closestParent, closestPath: closestPath };
        },

        _getChoosenPath: function (availPaths, closestTo, destination, choosenPath) {
            var sclst = this._getClosestPath(availPaths, closestTo);
            this._removeFromArray(availPaths, sclst.closestPath);
            var dclst = this._getClosestPath([sclst.closestPath], destination);
            choosenPath.push(_.extend(sclst.closestPath, { closest: dclst.closest }));
            var wdiff = Math.abs(destination.width - dclst.closest.width);
            var hdiff = Math.abs(destination.height - dclst.closest.height);
            for (var i = 0; i < availPaths.length && (wdiff < this._prevwdiff); i++) {
            //for (var i = 0; i < availPaths.length && (wdiff < this._prevwdiff || (wdiff <= this._prevwdiff && (hdiff !== this._prevhdiff || wdiff !== this._prevwdiff))) ; i++) {
            //for (var i = 0; i < availPaths.length && wdiff <= this._prevwdiff && wdiff >= 100; i++) {
                //var isExist = _.first(_.filter(choosenPath, function (cp) { return cp.from === dclst.closestPath.from && cp.to === dclst.closestPath.to; }));
                this._prevwdiff = wdiff; this._prevhdiff = hdiff;
                this._getChoosenPath(availPaths, dclst.closest, destination, choosenPath);
            }
        },

        _generateClosestPath: function (availPaths, source, destination) {
            var self = this;
            var choosenPath = [], closestTo = source;
            this._prevwdiff = 999999999; this._prevhdiff = 999999999;
            this._getChoosenPath(availPaths, closestTo, destination, choosenPath);
            return this._removeDuplicates(choosenPath);
        },

        _removeFromArray: function (availPaths, path) {
            var pathIndex = availPaths.indexOf(path);
            if (pathIndex > -1) availPaths.splice(pathIndex, 1);
            return availPaths;
        },

        _findPathByPoint: function (paths, point) {
            return _.first(_.filter(paths, function (path) { return (JSON.stringify(path.from) === JSON.stringify(point) || JSON.stringify(path.to) === JSON.stringify(point)); }));
        },

        _closestPoint: function (availPaths, source, destination) {
            var choosenPoint = [], closest = null;
            Two.Utils.each(availPaths, function (bipath, index, parent) {
                if (index !== 0) {
                    console.log('[width] ' + Math.abs(bipath.width - destination.width) + ' < ' + Math.abs(closest.width - destination.width) + ' : ' + (Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) + ' [height] ' + Math.abs(bipath.height - destination.height) + ' < ' + Math.abs(closest.height - destination.height) + ' : ' + (Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)));
                }
                if (closest == null || Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) {
                    choosenPoint.push(bipath);
                    closest = bipath;
                }
                if (closest == null || Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)) {
                    choosenPoint.push(bipath);
                    closest = bipath;
                }
            });
            return this._removeDuplicates(choosenPoint);
        },

        _closest: function (availPaths, source, destination) {
            var closest = null;
            Two.Utils.each(availPaths, function (bipath, index, parent) {
                if (closest == null || Math.abs(bipath.width - destination.width) < Math.abs(closest.width - destination.width)) {
                    closest = bipath;
                }
                if (closest == null || Math.abs(bipath.height - destination.height) < Math.abs(closest.height - destination.height)) {
                    closest = bipath;
                }
            });
            return closest;
        },

        _closestel: function () {
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
            curve.cap = 'round';
            //curve.opacity = 0.6;
            this._setLineWidth(curve);
            _.each(curve.vertices, function (v) {
                v.addSelf(curve.translation);
            });
            curve.translation.clear();
            this._addToGroup(curve);
        },

        _drawRectangle: function (x, y, width, height, radius, fill, stroke) {
            var rectangle = radius ? new Two.RoundedRectangle(x, y, width, height, radius) : new Two.Rectangle(x, y, width, height);
            if (!fill) {
                rectangle.noFill();
            }
            rectangle.fill = fill;
            rectangle.stroke = stroke;
            rectangle.opacity = 0.4;
            this._setLineWidth(rectangle);
            this._addToGroup(rectangle);
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