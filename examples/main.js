import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* // import i18n from './locales' */

import { $log } from 'xiaopubao-ui/src/utils/index.js'

/* // 导入组件库
// import XPBUI from './../packages'

// 正式
// import XPBUI from 'xiaopubao-ui/lib/xiaopubao-ui.umd'
// import XPBUI from 'xiaopubao-ui'

// 默认 xiaopubao-ui 样式
// import 'xiaopubao-ui/style/index.less'
// import '@/assets/css/project_normal.less' // 自定义相关项目配置 模拟 */
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
Vue.use(Antd)
// 注册组件库
/* Vue.use(XPBUI, {
  // 方式1
  // locale: i18n.locale,
  i18n: (key, value) => i18n.t(key, value)
}) */

Vue.config.productionTip = false
Vue.config.lang = 'en'
Vue.prototype.$log = $log
window.vue = Vue
new Vue({
  router,
  store,
  // i18n,
  render: h => h(App)
}).$mount('#app')
