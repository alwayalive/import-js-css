import importJsCss from 'import-js-css'

const key = "xxx"
//resourceMap 最好放全局配置
const resourceMap = {
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
}

//引入地图资源
importJsCss("timePicker", resourceMap )
.then( resources => {
	console.info("时间控价已经引入")
	// ...some code
})
//引入地图资源
importJsCss("ajaxFileUpload", resourceMap )
.then( resources => {
	console.info("异步上传插件已经引入")
	// ...some code
})
//引入地图资源
importJsCss("map", resourceMap )
.then( resources => {
	console.info("地图已经引入")
	// ...some code
})