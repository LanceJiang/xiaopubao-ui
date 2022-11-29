import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入组件库
import XPBUI from './../packages'
// 正式
// import XPBUI from 'xiaopubao-ui/lib/xiaopubao-ui.umd'
// import XPBUI from 'xiaopubao-ui'

// 默认 xiaopubao-ui 样式
import 'xiaopubao-ui/style/index.less'
// import '@/assets/css/project_normal.less' // 自定义相关项目配置 模拟
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
Vue.use(Antd)
// 注册组件库
Vue.use(XPBUI)

Vue.config.productionTip = false

window.vue = Vue
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
