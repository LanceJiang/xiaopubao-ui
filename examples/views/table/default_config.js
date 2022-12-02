const tPrefix = 'outboundOrder.table.'

let flag = false
const slot_user = (scope, h) => {
  if (!flag) {
    console.log(scope, '自定义 函数渲染')
    flag = true
  }
  return [<div style={'background: #f0f;'}>slot_user 函数渲染 slot:default </div>]
}

const userConfig = {
  t_label: `${tPrefix}user`,
  prop: 'local_user',
  field: 'local_user', // to prop
  /** 渲染自定义 可以使用 slots  && formatter */
  slots: {
    default: slot_user,
    header: 'slotName_title'
  },
  minWidth: '185px',
  showOverflowTooltip: false
  // // 暂时没有该功能（column 配置 column children） 配置仅做参考
  // children: [
  //   {
  //     label: 'child0_001',
  //     prop: 'child0_001'
  //   },
  //   {
  //     label: 'child0_002',
  //     prop: 'child0_002'
  //   }
  // ]
}
const testColumns = Array.from({ length: 20 }).map((_, i) => ({
  label: `${tPrefix}test_${i}`,
  title: `${tPrefix}test_${i}`, // todo
  prop: `test_${i}`,
  field: `test_${i}`
}))
export const columns = [
  userConfig,
  {
    t_label: `${tPrefix}orderNo`, // todo
    title: 'orderNo', // todo  同 t_label 处理方式
    prop: 'orderNo',
    field: 'orderNo',
    minWidth: '220px',
    // 用户提示配置
    titleHelp: {
      icon: 'xpb-iconfont xpb-question', // todo 自定义icon
      message: `<span style='background: #f00'>wo的 <br/>sssssssssss</span>`
    },
    slots: {
      default: ''
    },
    sortable: true,
    formatter() {
      return 'orderNo: formatter'
    }
  },
  ...testColumns,
  {
    t_label: 'xpb.table.action',
    title: 'xpb.table.action', // todo  同 t_label 处理方式
    // label: '测试的 action label 非 t_label',
    prop: 'action',
    field: 'action',
    slots: {
      default: 'action'
    },
    fixed: 'right'
  }
]

// 初始化 checkedOptions (用于 接口还没获取到 之前保存的columns 配置)
export const checkedOptions = columns.map((v) => v)

// 若有特殊的 默认配置 (产品特殊要求 含: column 展示配置  和 展示 顺序)
export const defaultCheckedOptions = columns.map((v) => v).reverse()
