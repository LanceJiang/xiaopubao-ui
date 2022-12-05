import packageJson from '../package.json'
import {
  // 全局对象
  VXETable,

  // 功能模块
  // Filter,
  // Menu,
  // Edit,
  // Export,
  // Keyboard,
  // Validator,

  // 可选组件
  // Icon,
  // Column,
  // Colgroup,
  // Grid,
  Toolbar,
  Pager,
  Header,
  Select as VxeSelect,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Input,
  // Textarea,
  // Button,
  // Modal,
  // Tooltip,
  // Form,
  // FormItem,
  // FormGather,
  // Optgroup,
  // Option,
  // Switch,
  // List,
  // Pulldown,

  // 表格
  Table as VXE_Table
} from 'vxe-table' // vxe-table表格插件
import VueStorage from 'vue-ls'
import locale from '../src/locale'
// import ComponentDemo from './ComponentDemo'
import Icon from './Icon'
import NoData from './NoData'
import Table from './Table'
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

import { $log, xeUtils } from '../src/utils'
// console.log(VXETable, 'vxetale')
// 存储组件列表
const components = [
  // ComponentDemo,
  Icon,
  NoData,
  Table
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
const version = packageJson.version

// 加载xiaopubao-svg icon && iconfont.css(eg:"xpb-iconfont xpb-xxx")
;(function() {
  const d = document
  const existIconVersion = [...d.querySelectorAll('.xpb-icon_svg')].map(v => v.getAttribute('version')).includes(version)
  if (!existIconVersion) {
    /** update 最新 iconfont(.css && .js) */
    const origin_prefix = '//at.alicdn.com/t/c/font_3797454_k534bjai98d'
    const link = d.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.className = 'xpb-icon_iconfont'
    link.setAttribute('version', version)
    link.setAttribute('origin', location.origin)
    link.href = `${origin_prefix}.css`
    d.getElementsByTagName('head')[0].appendChild(link)
    const s = d.createElement('script')
    s.className = 'xpb-icon_svg'
    s.src = `${origin_prefix}.js`
    s.setAttribute('version', version)
    s.setAttribute('origin', location.origin)
    d.getElementsByTagName('head')[0].appendChild(s)
  }
})()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(Vue, opts = {}) {
  // console.error(install, 'XIAOPUBAO install opts', opts)
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
  // Vue.use(VXETable)
  const Vxei18n = opts.i18n ? opts.i18n : (key, args) => xeUtils.toFormatString(xeUtils.get(require('vxe-table/lib/locale/lang/zh-CN'), key), args)
  VXETable.setup({
    size: 'mini',
    tooltipConfig: {
      theme: 'light'
    },
    // 对组件内置的提示语进行国际化翻译
    i18n: Vxei18n
  })
  // 对组件内置的提示语进行国际化翻译
  // i18n: (key, args) => i18n.t(key, args)

  Vue.use(VueStorage, {
    namespace: '', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  })
  // 表格功能
  // Vue.use(Filter)
  // .use(Edit)
  // .use(Menu)
  // .use(Export)
  // .use(Keyboard)
  // .use(Validator)

  // 可选组件
  // Vue.use(Icon)
  //   .use(Column)
  // .use(Colgroup)
  // .use(Grid)
  Vue.use(Toolbar)
    .use(Pager)
    .use(Header)
    .use(VxeSelect)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Radio)
  // .use(RadioGroup)
  // .use(RadioButton)
  // .use(Input)
  // .use(Textarea)
  // .use(Button)
  // .use(Modal)
  // .use(Tooltip)
  // .use(Form)
  // .use(FormItem)
  // .use(FormGather)
  // .use(Select)
  // .use(Optgroup)
  // .use(Option)
  // .use(Switch)
  // .use(List)
  // .use(Pulldown)

  // 安装表格
  Vue.use(VXE_Table)

  // 给 vue 实例挂载内部对象，例如：
  // Vue.prototype.$XModal = VXETable.modal
  // Vue.prototype.$XPrint = VXETable.print
  // Vue.prototype.$XSaveFile = VXETable.saveFile
  // Vue.prototype.$XReadFile = VXETable.readFile

  // 页面$log 打印
  Vue.prototype.$log = $log
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// console.warn(packageJson, 'packageJson  packageJson.version', packageJson.version)
export default {
  version,
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...components
}
