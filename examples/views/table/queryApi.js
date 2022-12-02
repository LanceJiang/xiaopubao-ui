const orderTotal = 876543
// 列表数据
export const getOrders = (input) => {
  // 模拟参数
  const { page, pageSize } = input
  return new Promise(resolve => {
    let length = pageSize
    if (page * pageSize > orderTotal) {
      length = orderTotal - (page - 1) * pageSize
    }
    console.time('test')
    setTimeout(() => {
      console.timeEnd('test')
      console.warn('模拟请求完成...')
      // 模拟数据
      const res = {
        data: Array.from({ length }).map((_, i) => {
          return { value: `testVal_${i}` }
        })
      }
      resolve(res.data)
    }, 1000 * Math.random())
  })
}
// 列表count 总数
export const getOrdersCount = (input) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟数据
      const res = {
        total: orderTotal
      }
      resolve(res.total)
    }, 1000 * Math.random())
  })
}
// 当前类型列表配置获取
export const getTableConfig = (input) => {
  // 请求参数拟定
  /* const params = {
    type: '表格类型唯一值标记',
    system: '系统标记'
  } */
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟数据
      const res = {
        /* t_label: String, // 多语言关键key
        label?: String, // 若不存在t_label 可使用 label
        [valueKey]: String, // valueKey 用于 作为唯一值鉴定用 todo delete
        checked: Boolean, // 是否选中 todo delete
        disabled?: Boolean, // disabled 的不允许删除 todo delete
        fixed?: Boolean || String, // disabled 的不允许删除 (disabled -> fixed)
        children?: Option[] // 同上配置 */
        columns: [{
          prop: 'action',
          field: 'action',
          t_label: 'xpb.table.action',
          fixed: 'right' // boolean string
        }, {
          prop: 'orderNo',
          field: 'orderNo',
          t_label: 'outboundOrder.table.orderNo'
          // fixed: true // boolean string
        }, { // 模拟 columns被调整后 label 被更改的字段 (校验 数据是否会转换为新值)
          prop: 'local_user',
          field: 'local_user',
          t_label: 'outboundOrder.table.userOld'
          // fixed: true // boolean string
        }, {
          prop: 'orderNo2',
          field: 'orderNo2',
          t_label: 'outboundOrder.table.orderNo2'
          // fixed: true // boolean string
        }]
      }
      resolve(res)
    }, 1000 * Math.random())
  })
}
