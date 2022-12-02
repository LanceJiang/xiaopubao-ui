// import ElementLocale from 'ant-design-vue/lib/locale'
// import element ui locale
import EnAntLocale from 'ant-design-vue/lib/locale/en_US'
import CNAntLocale from 'ant-design-vue/lib/locale/zh_CN'

// vxe-table 多语言注入
import EnVxeLocale from 'vxe-table/lib/locale/lang/en-US'
import CNVxeLocale from 'vxe-table/lib/locale/lang/zh-CN'
// import xiaopubao-ui locale 公用国际化 引入
// 本地 模拟多语言 测试
// // 此处使用方式是 结合 按需加载 提取locale 进行修改 i18n转译 当前组件没有做 语言方法提取
// import XpbLocale from 'xiaopubao-ui/src/locale' // 多语言 问题  lib  XpbLocale.i18n(fn) 修改完之后 未改变
import EnXpbLocale from 'xiaopubao-ui/src/locale/lang/en'
import CNXpbLocale from 'xiaopubao-ui/src/locale/lang/zh-cn'

// 正式环境使用
/* // import XpbLocale from 'xiaopubao-ui/lib/locale' // 多语言 问题  lib  XpbLocale.i18n(fn) 修改完之后 未改变
import EnAdbLocale from 'xiaopubao-ui/lib/locale/lang/en'
import CNAdbLocale from 'xiaopubao-ui/lib/locale/lang/zh-cn' */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

// import defined locale
import enLocale from '@/locales/lang/en'
import zhLocale from '@/locales/lang/zh-cn'

Vue.use(VueI18n)

const messages = {
  en: {
    ...EnAntLocale,
    ...EnVxeLocale,
    ...EnXpbLocale,
    ...enLocale
  },
  zh: {
    ...CNAntLocale,
    ...CNVxeLocale,
    ...CNXpbLocale,
    ...zhLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = 'zh'
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage
    return cookieLanguage
  }
  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  return 'en'
}
// init i18n
const i18n = new VueI18n({
  locale: getLocale(),
  messages,
  silentTranslationWarn: true
})

export default i18n
