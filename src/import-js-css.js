/**
 * 页面上已经加载过的资源标识
 * @type {[String]]}
 */
let installed = []

/**
 * 外部入口，串行/并行加载外部资源
 * 你需要提供一个资源字典，里面表明你要加载的外部资源路径、类型和资源key
 * @param  {String}  name       资源key
 * @param  {String}  resourceMap       资源字典
 * @param  {Boolean} linearLoad 采用线性
 * @return {Promise}             Promise后续操作
 */
function loadJsCss(name, resourceMap, linearLoad = false) {
    let promise = [];

    if (existed(name))
        return Promise.resolve();
    if (!resourceMap[name])
        return Promise.reject();

    if (Array.isArray(resourceMap[name]))
        promise = loadScript(resourceMap[name], name, linearLoad)
    else if (typeof resourceMap[name] === "object") {
        if (!!resourceMap[name].script) {
            promise = loadScript(resourceMap[name].script, name, linearLoad)
        }
        if (!!resourceMap[name].link) {
            promise = promise.concat(loadStyle(resourceMap[name].link, name))
        }
    } else
        promise = loadScript(resourceMap[name], name, linearLoad)

    if (typeof resourceMap[name].extra === "function")
        promise.push(resourceMap[name].extra())

    return Promise.all(promise).then(() => {
        installed.push(name)
    });
}

/**
 * 搜索存在的标识
 * @param  {String} name 资源key
 * @return {Boolean}      
 */
function existed(name) {
    return installed.indexOf(name) != -1
}


/**
 * 加载脚本资源
 * @param  {[type]} path   [description]
 * @param  {[type]} name   [description]
 * @param  {[type]} linear [description]
 * @return {[type]}        [description]
 */
function loadScript(path, name, linear) {
    return linear ? linearLoadScript(path, name) : parallelLoadScript(path, name)
}

/**
 * 线性加载Script脚本
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}      Promise后续操作
 */
function linearLoadScript(path, name) {
    let _path = Array.isArray(path) ? path : [path],
        gen = (function*() {
            for (let __path of _path) {
                yield new Promise((resolve, reject) => {
                    let script = document.createElement("SCRIPT");
                    script.type = "text/javascript";
                    script.src = __path;
                    script.setAttribute("__rs", name)
                    script.onload = function() {
                        resolve();
                    }
                    document.body.appendChild(script)
                })
            }
        })();
    return [new Promise((resolve, reject) => {
        next();

        function next() {
            let _next = gen.next();
            if (_next.done)
                return resolve();
            _next.value.then(script => {
                next()
            })
        }
    })]
}

/**
 * 并行加载Script脚本
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}     Promise后续操作
 */
function parallelLoadScript(path, name) {
    let _path = Array.isArray(path) ? path : [path];
    return _path.map(v => {
        return new Promise((resolve, reject) => {
            let script = document.createElement("SCRIPT");
            script.type = "text/javascript";
            script.src = v;
            script.setAttribute("__rs", name)
            script.onload = function() {
                resolve();
            }
            document.body.appendChild(script)
        })
    })
}

/**
 * 加载Style样式
 * @param  {String} path 资源请求路径
 * @param  {String} name 资源key
 * @return {[Promise]}      Promise后续操作
 */
function loadStyle(path, name) {
    let _path = Array.isArray(path) ? path : [path];
    return _path.map(v => {
        return new Promise((resolve, reject) => {
            let link = document.createElement("LINK");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = v;
            link.setAttribute("__rs", name)
            link.onload = function() {
                resolve();
            }
            document.body.appendChild(link)
        })
    })
}

export default loadJsCss