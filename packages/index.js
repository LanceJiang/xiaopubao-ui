import packageJson from '../package.json'
// import ComponentDemo from './ComponentDemo'
import Icon from './Icon'
import NoData from './NoData'
// import Table from './Table'
/* import DraggableNest from './DraggableNest'
import FormConfig from './FormConfig'
import FormConfigDialog from './FormConfigDialog'

import InputNumber from './InputNumber'
import Select from './Select'
import Dropdown from './Dropdown'
import Popover from './Popover'
import CustomRender from './CustomRender'
import SearchGroup from './SearchGroup'
import SearchFilterDrawer from './SearchFilterDrawer' */
// pdf 预览
// import PdfPreview from './PdfPreview'

// 以下组件放置 extra_load 配置交给 引用项目按需使用

import { $log } from '../src/utils'
// 存储组件列表
const components = [
  // ComponentDemo,
  Icon,
  NoData
  // Table
  // DraggableNest,
  // FormConfig,
  // FormConfigDialog,
  // InputNumber,
  // Select,
  // Dropdown,
  // Popover,
  // CustomRender,
  // SearchGroup,
  // SearchFilterDrawer
  // PdfPreview // todo 暂不做公用组件打包（pdfjsWorker.js 引入有问题 后续再说）暂时建议 src 引入 或者以该组件作为参考
]

// 加载xiaopubao-svg icon && iconfont.css(eg:"xpb-iconfont xpb-xxx")
;(function() {
  const d = document
  const iconDom = d.getElementById('x-icon')

  if (!iconDom) {
    /** update 最新 iconfont(.css && .js) */
    const origin_prefix = '//at.alicdn.com/t/c/font_3797454_ox4k61wfbd9'
    const link = d.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = `${origin_prefix}.css`
    d.getElementsByTagName('head')[0].appendChild(link)
    const s = d.createElement('script')
    s.id = 'x-icon'
    s.src = `${origin_prefix}.js`
    d.getElementsByTagName('head')[0].appendChild(s)
  }
})()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(Vue, opts = {}) {
  // console.error(install, 'XIAOPUBAO install opts', opts)
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))

  // 页面$log 打印
  Vue.prototype.$log = $log
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// console.warn(packageJson, 'packageJson  packageJson.version', packageJson.version)
export default {
  version: packageJson.version,
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...components
}
