<template>
<div class='flex-column-page-wrap pageWrap'>
  <vxe-toolbar>
    <template #buttons>
      <a-button @click="loadList(50)">50条</a-button>
      <a-button @click="loadList(100)">100条</a-button>
      <a-button @click="loadList(1000)">1k条</a-button>
      <a-button @click="loadList(10000)">1w条</a-button>
      <a-button @click="loadList(50000)">5w条</a-button>
      <a-button @click="loadList(100000)">10w条</a-button>
      <a-button @click="loadList(200000)">20w条</a-button>
    </template>
  </vxe-toolbar>
  <div class='vxeTableParentEl'>

  <vxe-table
    :data='list'
    border
    resizable
    autoResize
    show-overflow
    show-header-overflow
    show-footer-overflow
    ref="vxeTable"
    height="100%"
    :loading="loading"
    :checkbox-config="{checkField: 'checked'}"
    :scroll-y="{mode: 'wheel'}"
    >
    <template #slotHeader='{column}'>
      <span style='background: #f00;'>{{ $t(column.title) }}</span>
    </template>
<!--    :scroll-y="{mode: 'wheel'}"-->
<!--    <vxe-column type="seq" width="100" fixed="left"></vxe-column>
    <vxe-column type="checkbox" width="30px" fixed="left"></vxe-column>
    <vxe-column v-for='v of columns' :key='v.field' v-bind='v' />-->
  </vxe-table>

  </div>
</div>
</template>

<script>
import i18n from '@/locales'
import { getDeepValue, xeUtils } from 'xiaopubao-ui/src/utils/index'
const slotDefault = ({ row, column }, h) => {
  const val = row[column.property]
  // console.error(val, 'val slotDefault')
  const _params = getDeepValue(column, ['params']) || {}
  // 如果有多行省略号处理
  const ellipsis_line = _params.ellipsis_line
  if (ellipsis_line) {
    return [
      <a-tooltip overlayClassName='tooltipLight' placement={_params.placement || 'top'}>
        <span slot='title' domPropsInnerHTML={val} />
        <div class='text-overflow_ellipsis_line_2'
          style={`width: fit-content;-webkit-line-clamp: ${ellipsis_line}`}>{val || '--'}</div>
      </a-tooltip>
    ]
  }
  if (typeof val !== 'number') {
    return val || '--'
  }
  return val
}
const slotHeader_titleHelp = function($titleHelp = {}, sortableOptions, props, h) {
  // const { titleHelp, title } = props.column
  const { title } = props.column
  // 1.针对 column 配置有 titleHelp 对象的 进行默认提示处理
  const { message, icon } = $titleHelp || {}
  let TitleHelp = ''
  if (message) {
    TitleHelp = <a-tooltip placement='top'>
      <span slot='title' domPropsInnerHTML={message} />
      <i class={['xpb-iconfont', icon || 'xpb-question']} />
    </a-tooltip>
  }
  const _title = i18n.t(title)
  return [
    <div class='slot_titleHelpWrap'>
      <a-tooltip placement='top' title={_title}>
        <span class='label'>{_title}</span>
      </a-tooltip>
      {TitleHelp}
    </div>
  ]
}

export default {
  data () {
    const _this = this
    const test = Array.from({ length: 24 }).map((_, i) => {
      const idx = (i + 1)
      return {
        field: 'attr' + idx,
        title: 'Attr' + idx,
        width: 200
      }
    })
    const columns = [
      {
        field: 'attr0',
        // title: 'Attr0',
        title: 'xpb.table.action',
        width: 200,
        sortable: true,
        fixed: 'left'
      },
      ...test
    ]
    console.log(slotHeader_titleHelp, _this)
    columns.map(v => {
      v.slots = {
        default: slotDefault,
        // header: slotHeader_titleHelp.bind(_this, { }, { }),
        header: 'slotHeader'
      }
    })
    return {
      loading: false,
      columns,
      list: []
    }
  },
  created () {
    // this.$refs.vxeTable
    window.test = this
    this.loadList(50)
  },
  watch: {
    columns: {
      handler: function(newList, oldList) {
        console.error('columns 变更')
        const res = [
          {
            type: 'seq',
            width: '100',
            fixed: 'left'
          },
          {
            type: 'checkbox',
            width: '36px',
            fixed: 'left'
          }
        ].concat(newList)
        if (this.$refs.vxeTable) {
          this.loadColumn(res)
        } else {
          this.$nextTick(() => {
            this.loadColumn(res)
            // setTimeout(() => {
            //   this.updateSelectedRow()
            // }, 10)
          })
        }
      },
      immediate: true
      // deep: true
    }
  },
  methods: {
    loadList (size) {
      this.loading = true
      this.mockList(size).then(data => {
        // 使用函数式加载，阻断 vue 对大数据的监听
        const xTable = this.$refs.vxeTable
        const startTime = Date.now()
        if (xTable) {
          this.list = data
          // console.log(`用时${Date.now() - startTime}毫秒`)
          this.$message.success(`用时${Date.now() - startTime}毫秒`)
          this.loading = false
        }
      })
    },
    mockList (size) {
      return new Promise(resolve => {
        const list = []
        for (let i = 0; i < size; i++) {
          list.push({
            checked: false,
            attr0: 'attr0_row_' + i,
            attr1: 'attr1_row_' + i,
            attr2: 'attr2_row_' + i,
            attr3: 'attr3_row_' + i,
            attr4: 'attr4_row_' + i,
            attr5: 'attr5_row_' + i,
            attr6: i,
            attr7: '' + i,
            attr8: 'attr8_row_' + i,
            attr9: 'attr9_row_' + i,
            attr10: 'attr10_row_' + i,
            attr11: 'attr11_row_' + i,
            attr12: 'attr12_row_' + i,
            attr13: 'attr13_row_' + i,
            attr14: 'attr14_row_' + i,
            attr15: 'attr15_row_' + i,
            attr16: 'attr16_row_' + i,
            attr19: 'attr19_row_' + i,
            attr20: 'attr20_row_' + i,
            attr24: 'attr24_row_' + i,
            attr25: 'attr25_row_' + i
          })
        }
        resolve(list)
      })
    },
    loadColumn(columns) {
      const $scopedSlots = this.$scopedSlots
      const _this = this
      console.log('loadColumn $scopedSlots', columns, $scopedSlots)
      if (!_this) return console.log(xeUtils, 'sss')
      this.$refs.vxeTable.loadColumn(columns)
      xeUtils.eachTree(columns, function(column) {
        // if (!column) return
        // 对非组件级内置的 column类型 且 未定义formatter 进行默认 default处理
        if (!column.type && !column.formatter) {
          if (!column.slots) {
            column.slots = { default: slotDefault }
          } else if (!column.slots.default) {
            // 针对没有 column slot default 的 数据进行处理
            column.slots.default = slotDefault
          }
        } else {
          column.slots = column.slots || {}
        }
        // console.log(column, 'column.slots .....', column.slots)
        const setSlotFn = (() => {
          return process.env.NODE_ENV === 'development' ? (_slots, type, fn, _slotName) => {
            if (!fn) {
              _this.$log(`当前定义的 slots:${type} [${_slotName}] 没有设置`, 'warning', 'orange')
            }
            _slots[type] = fn || null
          } : (_slots, type, fn) => {
            _slots[type] = fn || null
          }
        })()
        const slots_key = Object.keys(column.slots || {})
        // headerName slot header 提示
        let slots_headerName = ''
        if (slots_key.length) {
          const slots = column.slots
          // const field = column.field
          // const _slotStringKeys = column._slotStringKeys || {}
          slots_key.map(type => {
            // 如果是 string 类型 使用 slotScope
            const slotName = slots[type]
            let _slotName = ''
            // const SlotStrKey = `${field}_${type}`
            if (typeof slotName === 'string') {
              if (type === 'header') {
                slots_headerName = slotName
              }
              _slotName = slotName
              // _slotStringKeys[SlotStrKey] = slotName
            }/* else if (_slotStringKeys[SlotStrKey]) {
              const slotFnKey = _slotStringKeys[SlotStrKey]
              if (slotFnKey) {
                _slotName = slotFnKey
              }
            } */
            if (_slotName) {
              const fn = $scopedSlots[_slotName]
              setSlotFn(column.slots, type, fn, _slotName)
            }
          })
          // column._slotStringKeys = _slotStringKeys
        }
        const $titleHelp = column.titleHelp // || column._titleHelp
        delete column.titleHelp
        // 自定义筛选配置
        const sortableOptions = getDeepValue(column, ['params', 'sortableOptions'])
        if (Object.keys($titleHelp || {}).length || Array.isArray(sortableOptions)) {
          console.log(slots_headerName, 'slots_headerName')
          /* // 若自定义过 header 将不做额外处理
          const slots_header = column.slots.header
          if (slots_header) {
            process.env.NODE_ENV === 'development' && _this.$log(`当前定义的 slots:header [${slots_headerName}] 已与默认 titleHelp 提示冲突 请在 header 定义 div.slot_titleHelpWrap 添加 设置`, 'warning', 'orange')
          } else {
            // column._titleHelp = $titleHelp
            column.slots.header = slotHeader_titleHelp.bind(_this, $titleHelp, sortableOptions)
          } */
        }
      })
      console.log(columns, 'columns')
      return this.$refs.vxeTable.loadColumn(columns)
    }
  }
}
</script>

<style scoped>
.pageWrap {
  padding-top: 12px;
  overflow: auto;
}
.vxeTableParentEl {
  flex: 1;
  overflow-y: hidden;
}
</style>
