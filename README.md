# import-js-css
你有没有试过在react中需要引用第三方库、脚本和样式，但是又想在用到的时候才引入（这样可以提升页面渲染速度，也可以减少bundle主文件的大小），很多以前的第三方库是不支持CommandJs规范，无法使用require；像百度地图、腾讯地图等异步加载js；第三方其他脚本和样式资源。`import-js-css`可以帮你解决这样的问题，你可以以各种姿势引入你的外部资源，串行的、并行的、多个脚本、多个样式、多个样式脚本混合引入都可以，前提是你要安装这个库。

Getting started
---------------
使用npm安装`import-js-css`
```shell
npm install import-js-css
```

### API
> 你得配置一个resourceMap，才能它才能知道你要怎么加载你的资源列表

| 属性 | 类型 | 说明 |
|-------------|-----------------|----------------------------------------------------------------|
| link | Array[String] 或者 String | 样式资源 |
| script | Array[String] 或者 String | 脚本资源，如果你仅仅只一个脚本资源，你可以这样`name:"script path"` |
| extra | Function | 你必须返回一个Promise对象，它会安排到加载资源的Promise队列中，你也必须resolve这个Promise，否者他会阻塞其他Promise队列 |

#### example
```js
import importJsCss from 'import-js-css'

//resourceMap 最好放全局配置
const resourceMap = [
	timePicker: {
        script: window.timePickerUrl.js,
        link: window.timePickerUrl.css,
    },
	ajaxFileUpload: "http://huayun-hl.oss-cn-shenzhen.aliyuncs.com/WeChat/vendors/ajaxfileupload.js",
	map: {
        script: [
        	`http://api.map.baidu.com/api?v=2.0&ak=${key}&callback=BMapInit`, 
        	"http://map.qq.com/api/js?v=2.exp&callback=qqMapInit"
        ],
        /**
         * extra支持一个奇怪的操作，会额外的往Promise队列中插入新的Promise
         * 你必须返回Promise对象，并且需要resolve,否则你的Promise队列将永远不会resolve
         * @return {Promise} 
         */
        extra() {
            return new Promise(resolve => {
                if (!!window.qq && !!qq.maps && !!qq.maps.LatLng && !!BMap)
                    resolve();
                let timer = setInterval(() => {
                    if (!!qq && !!qq.maps && !!qq.maps.LatLng && !!BMap) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 1000)
            })
        }
    },
]

//引入地图资源
importJsCss("map", resourceMap )
.then( resources => {
	// ...some code
})
```