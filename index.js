"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 页面上已经加载过的资源标识
 * @type {[String]]}
 */
var installed = [];

/**
 * 外部入口，串行/并行加载外部资源
 * 你需要提供一个资源字典，里面表明你要加载的外部资源路径、类型和资源key
 * @param  {String}  name       资源key
 * @param  {String}  resourceMap       资源字典
 * @param  {Boolean} linearLoad 采用线性
 * @return {Promise}             Promise后续操作
 */
function loadJsCss(name, resourceMap) {
    var linearLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var promise = [];

    if (existed(name)) return Promise.resolve();
    if (!resourceMap[name]) return Promise.reject();

    if (Array.isArray(resourceMap[name])) promise = loadScript(resourceMap[name], name, linearLoad);else if (_typeof(resourceMap[name]) === "object") {
        if (!!resourceMap[name].script) {
            promise = loadScript(resourceMap[name].script, name, linearLoad);
        }
        if (!!resourceMap[name].link) {
            promise = promise.concat(loadStyle(resourceMap[name].link, name));
        }
    } else promise = loadScript(resourceMap[name], name, linearLoad);

    if (typeof resourceMap[name].extra === "function") promise.push(resourceMap[name].extra());

    return Promise.all(promise).then(function () {
        installed.push(name);
    });
}

/**
 * 搜索存在的标识
 * @param  {String} name 资源key
 * @return {Boolean}      
 */
function existed(name) {
    return installed.indexOf(name) != -1;
}

/**
 * 加载脚本资源
 * @param  {[type]} path   [description]
 * @param  {[type]} name   [description]
 * @param  {[type]} linear [description]
 * @return {[type]}        [description]
 */
function loadScript(path, name, linear) {
    return linear ? linearLoadScript(path, name) : parallelLoadScript(path, name);
}

/**
 * 线性加载Script脚本
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}      Promise后续操作
 */
function linearLoadScript(path, name) {
    var _path = Array.isArray(path) ? path : [path],
        gen = regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 3;
                        _loop = regeneratorRuntime.mark(function _loop() {
                            var __path;

                            return regeneratorRuntime.wrap(function _loop$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            __path = _step.value;
                                            _context.next = 3;
                                            return new Promise(function (resolve, reject) {
                                                var script = document.createElement("SCRIPT");
                                                script.type = "text/javascript";
                                                script.src = __path;
                                                script.setAttribute("__rs", name);
                                                script.onload = function () {
                                                    resolve();
                                                };
                                                document.body.appendChild(script);
                                            });

                                        case 3:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _loop, _this);
                        });
                        _iterator = _path[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 11;
                            break;
                        }

                        return _context2.delegateYield(_loop(), "t0", 8);

                    case 8:
                        _iteratorNormalCompletion = true;
                        _context2.next = 6;
                        break;

                    case 11:
                        _context2.next = 17;
                        break;

                    case 13:
                        _context2.prev = 13;
                        _context2.t1 = _context2["catch"](3);
                        _didIteratorError = true;
                        _iteratorError = _context2.t1;

                    case 17:
                        _context2.prev = 17;
                        _context2.prev = 18;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 20:
                        _context2.prev = 20;

                        if (!_didIteratorError) {
                            _context2.next = 23;
                            break;
                        }

                        throw _iteratorError;

                    case 23:
                        return _context2.finish(20);

                    case 24:
                        return _context2.finish(17);

                    case 25:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee, this, [[3, 13, 17, 25], [18,, 20, 24]]);
    })();
    return [new Promise(function (resolve, reject) {
        next();

        function next() {
            var _next = gen.next();
            if (_next.done) return resolve();
            _next.value.then(function (script) {
                next();
            });
        }
    })];
}

/**
 * 并行加载Script脚本
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}     Promise后续操作
 */
function parallelLoadScript(path, name) {
    var _path = Array.isArray(path) ? path : [path];
    return _path.map(function (v) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement("SCRIPT");
            script.type = "text/javascript";
            script.src = v;
            script.setAttribute("__rs", name);
            script.onload = function () {
                resolve();
            };
            document.body.appendChild(script);
        });
    });
}

/**
 * 加载Style样式
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}      Promise后续操作
 */
function loadStyle(path, name) {
    var _path = Array.isArray(path) ? path : [path];
    return _path.map(function (v) {
        return new Promise(function (resolve, reject) {
            var link = document.createElement("LINK");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = v;
            link.setAttribute("__rs", name);
            link.onload = function () {
                resolve();
            };
            document.body.appendChild(link);
        });
    });
}

exports.default = loadJsCss;