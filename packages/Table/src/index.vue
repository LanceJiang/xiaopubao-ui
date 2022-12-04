<!--
 申明： 本组件通过 vxe-table 插件 兼容目前项目 修整
 相关配置参考： https://xuliangzhan_admin.gitee.io/vxe-table/v3/#/table/api
 -->
<!--<template>
  <div class="xpb-table-warp">
    <div v-show="computedOptions.loading" class="tableLoading">
      <a-spin tip="加载中..."/>
    </div>
    <div class="tableBody">
      <vxe-toolbar class="vxeToolbar" ref="vxeToolbar">
        <template #buttons>
          <slot name="toolLeft" :curPageSelectLength="curPageSelectLength"/>
          <div v-show="showSelectLeft" class="selectedWrap">已选择<span>{{ curPageSelectLength }}</span>条</div>
        </template>
        <div class="toolRight" slot="tools">
          <div v-show="showSelectRight" class="selectedWrap">已选择<span>{{ curPageSelectLength }}</span>条</div>
          <slot name="toolRightUp"/>
          &lt;!&ndash; localStorage 存储型 提示 文句 &ndash;&gt;
          <template v-if="tipMessage.message">
            &lt;!&ndash; 关闭一次过后 &ndash;&gt;
            <a-tooltip v-if="tipMessage_hidden" placement="rightTop">
              <template slot="title">
                <span v-html="tipMessage.message" />
              </template>
              <a-button class="data-btn icon-button"><i class="xpb-iconfont xpb-data"></i></a-button>
            </a-tooltip>
            &lt;!&ndash; 未操作时 &ndash;&gt;
            <a-tooltip v-else :getPopupContainer="(triggerNode) => triggerNode.parentNode" :overlayStyle="{ 'max-width': 'max-content' }" visible placement="left">
              <template slot="title">
                <div style="display: flex; align-items: flex-start;">
                  <span v-html="tipMessage.message"/>
                  <i class="xpb-iconfont xpb-close" style="cursor: pointer;font-size: 12px;" @click="closeTipMessage"></i>
                </div>
              </template>
              <a-button class="data-btn icon-button"><i class="xpb-iconfont xpb-data"></i></a-button>
            </a-tooltip>
          </template>

          <a-tooltip v-if="toolsIcon.includes('refresh')">
            <template slot="title">刷新</template>
            <a-button class="refresh-btn icon-button" @click="refreshHandler"><i class="xpb-iconfont xpb-refresh"/></a-button>
          </a-tooltip>

          <a-tooltip v-if="toolsIcon.includes('download')">
            <template slot="title">导出</template>
            <a-button class="download-btn icon-button" @click="$emit('downloadHandler')"><i class="xpb-iconfont xpb-download"/></a-button>
          </a-tooltip>

          &lt;!&ndash; 额外的自定义功能按钮 slot place &ndash;&gt;

          <slot name="toolRight"/>

&lt;!&ndash;          <TableColumnsPopover
            ref="tableColumnsPopover"
            v-if="toolsIcon.includes('custom')"
            v-bind="columnsConfig"
            :visible.sync="customDialogVisible"
            :submit="customColumnsSubmit"
            @hook:mounted="tableColumnsMounted"
          >
            <a-button class="custom-btn">自定义列</a-button>
          </TableColumnsPopover>&ndash;&gt;
          &lt;!&ndash; <vxe-button type="text" icon="vxe-icon&#45;&#45;funnel" class="tool-btn">test测试</vxe-button> &ndash;&gt;
        </div>
      </vxe-toolbar>
      <slot name="alertTip"></slot>
      <div class="vxeTableParentEl">
        <vxe-table
          ref="vxeTable"
          class="vxeTable"
          :seq-config="seqConfig"
          v-bind="localTableOptions"
          :data="list"
          @cell-click="cellClick"
          @sort-change="tableSortChange"
          :filter-config="tableOptions.filterConfig"
          :tree-config="tableOptions.treeConfig"
          @filter-change="filterChangeEvent"
          @checkbox-change="checkboxChange"
          @checkbox-all="checkboxChange"
          @current-change="currentChange"
          @toggle-row-expand="$emit('toggleRowExpand', $event)"
          @hook:mounted="tableMounted"
          @scroll="$emit('tableScroll', $event)"
        >
          <template #empty>
            &lt;!&ndash;:class='`local_noDataWrap_${computedOptions.noData.size}`'&ndash;&gt;
            <NoData
              v-show="!computedOptions.loading"
              v-bind="computedOptions.noData"/>
          </template>
        </vxe-table>
      </div>
    </div>
    <div class="tableFooterWrap">
      &lt;!&ndash; 分页器 &ndash;&gt;
      <vxe-pager
        v-if="total > 0 && computedOptions.showPagination"
        border
        size="small"
        :page-sizes="computedOptions.pageSizes"
        :current-page="searchParams.page"
        :page-size="searchParams.pageSize"
        :total="total"
        :pager-count="computedOptions.pagerCount"
        :auto-hidden="computedOptions.autoHidden"
        :layouts="computedOptions.layouts"
        @page-change="handlePageChange"
      >
        &lt;!&ndash; 自定义 pager_left &ndash;&gt;
        <template v-slot:left>
          <slot name="pagerLeft"/>
        </template>
      </vxe-pager>
      &lt;!&ndash; if 判断是展示相关选中的项列表 be todo &ndash;&gt;
    </div>
    <CustomSortPopover v-if="false"/>
    &lt;!&ndash; 可以放弹窗/底部自定义 &ndash;&gt;
    <slot/>
  </div>
</template>-->
<script lang='jsx'>
import _ from 'lodash'
import TableColumnsPopover from './TableColumnsPopover'
import { xeUtils, getDeepValue } from 'xiaopubao-ui/src/utils'
import CustomSortPopover from './CustomSortPopover'
import NoData from 'xiaopubao-ui/packages/NoData'
// import Icon from 'xiaopubao-ui/packages/Icon'
import { t } from 'xiaopubao-ui/src/locale'
// console.log(Icon, 'icon')
// 针对默认的数据展示添加slot
const slotDefault = ({ row, column }, h) => {
  const val = row[column.property]
  const _params = getDeepValue(column, ['params']) || {} // params: { ellipsis_line, placement }
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
// 可以配置 自定义筛选,  titleHelp icon提示
const defaultRenderHeader = function($titleHelp = {}, props, h) {
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
  // 2.自定义筛选配置
  let CustomSort = ''
  const sortableConfig = getDeepValue(props.column, ['params', 'sortableConfig']) || {}
  // 存在下拉选项 创建自定义排序
  if (Array.isArray(sortableConfig.options)) {
    // console.warn(sortableConfig, 'sortableOptions todo  enter')
    // 自定义筛选配置
    CustomSort = <CustomSortPopover
      props={sortableConfig}
      searchParams={this.searchParams}
      onSubmit={this.customSortSubmit}
    />
  }
  const _title = (title + '').includes('.') ? t(title) : title
  return [
    <div class='slot_titleHelpWrap'>
      <a-tooltip placement='top' title={_title}>
        <span class='label'>{_title}</span>
      </a-tooltip>
      {TitleHelp}
      {CustomSort}
    </div>
  ]
}

const render = function(h) {
  const {
    curPageSelectLength,
    showSelectLeft,
    showSelectRight,
    computedOptions,
    tipMessage,
    tipMessage_hidden,
    toolsIcon,
    seqConfig,
    localTableOptions,
    list,
    tableOptions,
    searchParams
  } = this
  const tableOn = {
    'cell-click': this.cellClick,
    'sort-change': this.tableSortChange,
    'filter-change': this.filterChangeEvent,
    'checkbox-change': this.checkboxChange,
    'checkbox-all': this.checkboxChange,
    'current-change': this.currentChange,
    'toggle-row-expand': ($event) => this.$emit('toggleRowExpand', $event),
    'hook:mounted': this.tableMounted,
    'scroll': ($event) => this.$emit('tableScroll', $event)
  }
  return <div class='xpb-table-warp'>
    <div v-show={computedOptions.loading} class='tableLoading'>
      <a-spin tip='加载中...' />
    </div>
    <div class='tableBody'>
      {/* todo custom */}
      <vxe-toolbar custom class='vxeToolbar' ref='vxeToolbar'>
        <template slot='buttons'>
          <slot name='toolLeft' curPageSelectLength={curPageSelectLength} />
          <div v-show={showSelectLeft} class='selectedWrap'>已选择<span>{curPageSelectLength}</span>条</div>
        </template>
        <div class='toolRight' slot='tools'>
          <div v-show={showSelectRight} class='selectedWrap'>已选择<span>{ curPageSelectLength }</span>条</div>
          <slot name='toolRightUp' />
          {/* localStorage 存储型 提示 文句 */}
          {
            tipMessage.message && (tipMessage_hidden ? (
              <a-tooltip placement='right-Top'>
                <template slot='title'>
                  <span v-html='tipMessage.message' />
                </template>
                <a-button class='data-btn icon-button'><i class='xpb-iconfont xpb-data'></i></a-button>
              </a-tooltip>
            ) : (
              <a-tooltip getPopupContainer={(triggerNode) => triggerNode.parentNode} overlayStyle={{ 'max-width': 'max-content' }} visible placement="left">
                <template slot="title">
                  <div style="display: flex; align-items: flex-start;">
                    <span v-html={tipMessage.message}/>
                    <i class="xpb-iconfont xpb-close" style="cursor: pointer;font-size: 12px;" onClick={this.closeTipMessage}></i>
                  </div>
                </template>
                <a-button class="data-btn icon-button"><i class="xpb-iconfont xpb-data"></i></a-button>
              </a-tooltip>
            ))}
          {
            toolsIcon.includes('refresh') && <a-tooltip>
              <template slot='title'>刷新</template>
              <a-button class='refresh-btn icon-button' onClick={this.refreshHandler}><i
                class='xpb-iconfont xpb-refresh' /></a-button>
            </a-tooltip>
          }
          {
            toolsIcon.includes('custom') && <TableColumnsPopover
              ref='tableColumnsPopover'
              props={this.columnsConfig}
              value={this.checkedOptions}
              on={this.columnsPopoverOn}
            >
              {/* submit = { this.customColumnsSubmit } */}
              <a-button class='custom-btn'>自定义列</a-button>
            </TableColumnsPopover>
          }

          {/*! --额外的自定义功能按钮 slot place -- */}
          <slot name='toolRight' />
        </div>
      </vxe-toolbar>
      <slot name='alertTip'></slot>
      <div class='vxeTableParentEl'>
        {/* scroll-y={{ mode: 'wheel' }} */}
        <vxe-table
          ref='vxeTable'
          class='vxeTable'
          seq-config={seqConfig}
          props={localTableOptions}
          data={list}
          filter-config={tableOptions.filterConfig}
          tree-config={tableOptions.treeConfig}
          on={tableOn}>
          <template slot='empty'>
            <NoData
              v-show={!computedOptions.loading}
              props={computedOptions.noData} />
          </template>
        </vxe-table>
      </div>
    </div>
    <div class='tableFooterWrap'>
      {/* 分页器 */}
      {
        this.total > 0 && computedOptions.showPagination && (<vxe-pager
          border
          size='small'
          page-sizes={computedOptions.pageSizes}
          current-page={searchParams.page}
          page-size={searchParams.pageSize}
          total={this.total}
          pager-count={computedOptions.pagerCount}
          auto-hidden={computedOptions.autoHidden}
          layouts={computedOptions.layouts}
          on-page-change={this.handlePageChange}
        >
          {/* 自定义 pager_left */}
          <template slot='left'>
            <slot name='pagerLeft' />
          </template>
        </vxe-pager>)
      }
      {/* if 判断是展示相关选中的项列表 be todo */}
    </div>
    {/* 可以放弹窗/底部自定义 */}
    <slot />
  </div>
}
console.error(render, 'render')
export default {
  name: 'XTable',
  componentName: 'XTable',
  components: {
    TableColumnsPopover,
    CustomSortPopover,
    NoData
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }, // 后台数据列表
    selectedList: {
      type: Array,
      default: () => []
    },
    /**
     * [{
     *     field, // 属性名
     *     title, // 列名
     *     align, // 对齐方式
     *     width, // 列宽
     *     minWidth, // 最小列宽
     *     sortable, // 是否允许排列顺序
     *     formatter: function(row, column){}, // 格式化 [Function, Array, String]
     *     slots: {
     *       // slots不同类型 scope 关键数据项描述
            // header: '#slotName || render function', // { $columnIndex, $rowIndex, rowIndex, $table, columnIndex, column } // rowIndex 是实际的 index $rowIndex 为虚拟渲染的 index
            // default: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items, row, rowIndex } // items data
            // footer: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items } // items [当前 行 的 内容数据列表] data [所有的footer行数据数组]
            default: 'imageView',
              // header: 'num_footer', // slot 写法
              footer: (args, h) => {
                const { items, _columnIndex } = args
                // 渲染类型1： 使用渲染函数
                // return [
                //   h('a-button', {
                //     style: {
                //       color: 'green'
                //     },
                //     on: {
                //     }
                //   }, `[累计]: ${items[_columnIndex]}`)]
                // 渲染类型2： 使用 JSX 渲染/
                return [
                  <a-button status="primary" size="mini">按钮</a-button>,
                  <span>累计：{ items[_columnIndex] }</span>
                ]
              }
     *     }
     * }]
     */
    columns: {
      // 可以配置(嵌套类型) [{title: '有children 的父级(类型一)', children: [{field, title,width....}]}, {field,title,width...}]
      type: Array,
      default: () => []
    },
    // 选中column的配置参数
    checkedOptions: {
      type: Array,
      default: () => []
    },
    // 自定义配置列 相关参数
    columnsConfig: {
      type: Object,
      default: () => ({
        columns: []
        // title: '自定义列表字段',
        // placement: 'topLeft',
        // getPopupContainer: (triggerNode) => triggerNode.parentNode,
        // beforeSubmitHandler: Function,
        // sortable: true, // Boolean 右侧栏排序列表是否展示
        // defaultCheckedOptions: Array 没有存储数据时 系统给予的默认配置
      })
    },
    customColumnsSubmit: {
      type: Function,
      default: function (popover) {
        console.error(popover, 'todo...')
        const options = popover.checkedOptions // 提交的 columns数据
        console.error(options, 'options length todo')
        popover.loading = true
        // then
        popover.loading = false
        this.$message.success('列表自定义配置成功~')
        // this.$emit('getCustomColumns', options)
        popover.closeDialog()
      }
    },
    // 筛选列表
    searchParams: {
      type: Object,
      default: () => ({
        page: 1, // 页数
        pageSize: 20
      })
    },
    total: {
      type: Number,
      default: 0
    }, // 总数
    /**
     * table 表格的控制参数
     * 具体配置参考 localTableOptions > defaultOptions
     */
    tableOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * table 额外自定义的表格控制参数
     * 具体配置参考 computedOptions > defaultOptions
     */
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * table 表格的工具栏 常用icon 展示数组 [刷新, 自定义配置列]
     */
    toolsIcon: {
      type: Array,
      // default: () => ['refresh', 'custom']
      default: () => ['refresh', 'custom']
    },
    // 选中行的数据
    curRow: {
      type: Object
    },
    tipMessage: {
      type: Object,
      default: () => ({
        // localKey: '' // 保存本地localStorage 的 key 值 【全局唯一】
        // message: '' // 提示的消息
      })
    },
    sortConfig: {
      type: Object,
      default: () => ({
        trigger: 'cell',
        remote: true
      })
    }
  },
  render,
  data() {
    const _this = this
    return {
      storageArr: [], // 临时存储的数组
      curPageSelect: [], // 当前列表选中的数据
      seqConfig: {
        seqMethod: ({
          // row,
          rowIndex,
          $seq,
          seq
          // ...opts
          // column,
          // columnIndex
        }) => {
          // console.log(rowIndex, $seq, seq, 'rowIndex, $seq, seq')
          const searchParams = this.searchParams
          if (rowIndex >= 0) {
            let _index = ++rowIndex
            if (searchParams.pageSize) {
              _index = searchParams.pageSize * (searchParams.page - 1) + _index
            }
            return _index
          } else if ($seq) {
            // (rowIndex 为 -1)$seq 为字符串(非子级为 '') 有这个表示为子级 对应的上级的 第几项
            // $seq: '2', seq: 1 // 2级
            // $seq: '2.1.1', seq: 1 // 多级
            // const []
            let _index = parseInt($seq) // '2.1.1' ->  2
            let $seq_suffix = ''
            if (searchParams.pageSize) {
              _index = searchParams.pageSize * (searchParams.page - 1) + _index
            }
            if ($seq.includes('.')) {
              // '2.1.1' -> .1.1
              $seq_suffix = $seq.replace(/^\d+(.*)$/, '$1')
            }
            return `${_index}${$seq_suffix}.${seq}`
          }
        }
      },
      // customDialogVisible: false,
      tipMessage_hidden: false,
      columnsPopoverOn: {
        // 'update:visible': _this.updateDialogVisible,
        'hook:mounted': _this.tableColumnsMounted,
        'input': _this.checkedOptionsChange
      }
    }
  },
  computed: {
    localTableOptions() {
      const defaultOptions = {
        // rowId: 'id', // 唯一id
        border: false,
        resizable: true, // 是否允许拖动
        highlightHoverRow: true,
        highlightCurrentRow: true, // 是否要高亮当前行
        // height: 'auto',
        height: '100%',
        // showOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip [纯展示数据才使用（若有其他功能加上这个 展示会有问题!!!!）]
        showHeaderOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip // title, ellipsis
        showFooterOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip // title, ellipsis
        autoResize: true
        // scrollY: {
        //   gt: 100
        // }
      }
      return { ...defaultOptions, rowClassName: this.customRowBgc, sortConfig: this.sortConfig, ...this.tableOptions }
    },
    localColumns() {
      const { showIndex, showFilling, multipleSelect } = this.computedOptions
      const _columns = []
      multipleSelect && _columns.push({
        showHeaderOverflow: false,
        showOverflow: false,
        resizable: false,
        type: 'checkbox',
        width: '30px',
        fixed: 'left'
      })
      showIndex && _columns.push({
        type: 'seq',
        title: '序号',
        resizable: false,
        align: 'left',
        width: 60,
        fixed: 'left'
      })
      // console.error('重新渲染生成 localColumns')
      // 优化：涉及到columns 中 column 的 slots 是 string 类型 进行 slotScope 替换的 由于引用关系 导致 渲染相互覆盖的问题
      return _columns.concat(_.cloneDeep(this.columns.filter(Boolean)), showFilling ? [{
        title: '',
        align: 'center',
        minWidth: 0,
        slots: { default: () => '' }
      }] : [])
    },
    computedOptions() {
      const defaultOptions = {
        // 分页器参数
        showPagination: true, // 是否展示 分页器栏
        pageSizes: [20, 50, 70, 100], // 页面配置
        layouts: ['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'FullJump'],

        // 额外table自定义参数
        showIndex: false, // 是否展示序号
        showFilling: true, // 是否默认填充空白
        showSelectPlace: 'left', // 配置列表选中 个数展示位置 (left, right) 其他类型为不展示(eg: false, none)
        multipleSelect: false, // 是否多选
        // multipleSelectedKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态
        // multipleSelectedLabel: 'name', // 多选展示的 label
        // curRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态
        loading: false, // 是否展示loading
        noData: { size: 'middle', message: '暂无数据' } // 针对没有数据时展示 {size, message}
      }
      return {
        ...defaultOptions,
        ...this.options,
        noData: Object.assign(defaultOptions.noData, this.options.noData || {})
      }
    },
    curPageSelectLength() {
      // if (!this.computedOptions.multipleSelect) return 0
      const curPageSelect = this.curPageSelect
      if (Array.isArray(curPageSelect)) return curPageSelect.length
      return 0
    },
    showSelectLeft() {
      return this.computedOptions.showSelectPlace === 'left' && this.curPageSelectLength
    },
    showSelectRight() {
      return this.computedOptions.showSelectPlace === 'right' && this.curPageSelectLength
    }
  },
  created() {
    /* this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$vxeTable.connect(this.$refs.vxeToolbar)
    }) */

    // 监听 父级调用 XTable 的 内部方法 触发
    this.$on('XTableAction', (handlerArr = [], params) => {
      // console.log(handlerArr, 'XTableAction handlerArr params', params)
      this.$nextTick(() => {
        const fn = getDeepValue(this, handlerArr)
        if (typeof fn === 'function') {
          if (params !== undefined) {
            fn(params)
          } else {
            fn()
          }
        }
      })
    })
  },
  mounted() {
    if (this.columns && this.columns.length) {
      this.loadColumn(this.localColumns)
    }
  },
  watch: {
    list: {
      // 监听 list发生变化  （用于 多选时 切换页面做触发...）
      handler: function(newList, oldList) {
        // console.log(newList, 'list.........')
        // 判断是否为多选
        // const {
        //   multipleSelect,
        //   multipleSelectedKey = 'id',
        //   curRowKey = 'id'
        // } = this.computedOptions
        // if (multipleSelect) {
        //   // 判断是否为多选
        //   const {
        //     selectedList = [] // 获取是 原来被选中的值... (通过x_y 防止 fix xY --> x-y 通过$attr 无法读取)
        //   } = this.$props
        //   const indexs = []
        //   const storageArr = []
        //   const curPageSelect = []
        //   selectedList.map(item => {
        //     const _index = newList.findIndex(_item => {
        //       return _item[multipleSelectedKey] === item[multipleSelectedKey]
        //     })
        //     if (_index !== -1) {
        //       indexs.push(_index)
        //       curPageSelect.push(item)
        //     } else {
        //       // 当前页没有的 数据 作为临时存储 在更新数据之前  合并当前页被选中的数据 提交给父级组件
        //       storageArr.push(item)
        //     }
        //   })
        //   this.storageArr = storageArr
        //   this.curPageSelect = curPageSelect
        //   this.$nextTick(() => {
        //     indexs.forEach(index => {
        //       this.$vxeTable.toggleCheckboxRow(
        //         this.list[index],
        //         true
        //       ) // 遍历被选中的 多选
        //     })
        //   })
        // }
        this.updateSelectedRow()
        this.$nextTick().then(this.handleDefaults)
      },
      deep: true
    },
    curRow: {
      handler: function(newList, oldList) {
        this.updateSelectedRow()
      }
    },
    //  columns 动态支持
    columns: {
      handler: function(newList, oldList) {
        if (this.$vxeTable) {
          this.loadColumn(this.localColumns)
        } else {
          this.$nextTick(() => {
            this.loadColumn(this.localColumns)
            // setTimeout(() => {
            //   this.updateSelectedRow()
            // }, 10)
          })
        }
      }
      // deep: true
    },
    searchParams(val) {
      // 重新请求后 更新选中的records
      this.checkboxChange({ records: [] })
    },
    // 对于options中多选配置项值的变化触发loadColumn方法（如动态变更是否展示多选框）
    'options.multipleSelect': {
      handler(val) {
        this.$nextTick(() => {
          this.loadColumn(this.localColumns)
        })
      }
    },
    tipMessage: {
      handler(tipMessage) {
        const localKey = tipMessage.localKey
        if (localKey) {
          this.tipMessage_hidden = this.$ls.get(localKey)
          return
        }
        this.tipMessage_hidden = false
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleDefaults() {
      // this.sortConfig && this.handleDefaultSort()
      const localTableOptions = this.localTableOptions
      const treeConfig_expandAll = getDeepValue(localTableOptions, ['treeConfig', 'expandAll'])
      treeConfig_expandAll && this.$vxeTable.setAllTreeExpand(true)
      // console.log('default 渲染 后期对其他相关 再进一步优化 todo...')
    },
    /**
     * 对列表的 sort 进行更新（使用场景：table columns 删除 新增 替换）
     * // sortConfigs: string | { field: string | ColumnInfo, order: 'desc' | 'asc' | null } | { field: string | ColumnInfo, order?: 'desc' | 'asc' | null }[],
     * // order?: 'desc' | 'asc' | null
     */
    handleDefaultSort(sortConfig, order) {
      this.$vxeTable.sort(sortConfig, order)
    },
    loadColumn(columns) {
      // 跨层级 传入 会变成 renderFunction
      const $scopedSlots = this.$scopedSlots
      const _this = this
      // console.error(this.columns, 'columns', _this)
      // console.log('loadColumn $scopedSlots', columns, $scopedSlots)
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
        column.titleHelp && console.warn(column, 'column', JSON.stringify(column))
        const slots_header = column.slots.header
        if (slots_header) {
          // 若自定义过 header 将不做额外处理
          process.env.NODE_ENV === 'development' && _this.$log(`当前定义的 slots:header [${slots_headerName}] 已与默认 titleHelp 提示冲突 请在 header 定义 div.slot_titleHelpWrap 添加 设置`, 'warning', 'orange')
        } else {
          const $titleHelp = column.titleHelp // || column._titleHelp
          delete column.titleHelp
          column.slots.header = defaultRenderHeader.bind(_this, $titleHelp)
        }
      })
      // console.log(columns, 'columns', defaultRenderHeader, xeUtils, slotDefault)
      return this.$vxeTable.loadColumn(columns)
    },
    updateDialogVisible(bool) {
      this.customDialogVisible = bool
    },
    tableMounted() {
      this.$vxeTable = this.$refs.vxeTable
    },
    tableColumnsMounted() {
      // 是否调整 todo... ($tableColumnsDialog -> 改为 tableColumnsPopover)
      this.$tableColumnsDialog = this.$refs.tableColumnsPopover
    },
    // 更新选中行
    updateSelectedRow() {
      const { curRowKey = 'id' } = this.computedOptions
      const curRow = this.curRow || {}
      if (!curRow[curRowKey]) return // 没有选中项的不做处理
      // 高亮数据判断
      if (curRow && Object.keys(curRow).length) {
        let curRowIndex = -1
        curRowIndex = this.list.findIndex(_item => {
          return _item[curRowKey] === curRow[curRowKey]
        })
        this.$nextTick(() => {
          curRowIndex > -1 && this.$vxeTable.setCurrentRow(this.list[curRowIndex]) // 高亮原本被选中的数据
        })
      }
    },
    // 排序
    tableSortChange({ order, property: sort }) {
      const _searchParam = { sort, sort_type: order ? order.toUpperCase() : null }
      this.$emit('update:searchParams', { ...this.searchParams, ..._searchParam })
      // this.$vxeTable.sort(sort, order)
    },
    filterChangeEvent({ column, values }) {
      if (!this.tableOptions.filterConfig || !this.tableOptions.filterConfig.remote) {
        return
      }
      const _searchParam = {}
      _searchParam[column.property] = values
      this.$emit('update:searchParams', { ...this.searchParams, ..._searchParam })
    },
    resetAllCheckboxRow() {
      // 全部清空 并 触发 checkboxChange
      this.$vxeTable.triggerCheckAllEvent(null, false)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.$emit('update:searchParams', { ...this.searchParams, page: currentPage, pageSize })
      // this.$emit('updateSearchParams', { ...this.searchParams, page: currentPage, pageSize })
    },
    // 支持多选时 行选中触发
    checkboxChange({ records }) {
      // console.warn(records.concat(this.storageArr), 'currentChange')
      console.log('checkboxChange', records)
      this.curPageSelect = records
      // this.$emit('checkboxChange', records.concat(this.storageArr)) // 用于多切换页 保存的情况
      this.$emit('checkboxChange', records)
    },
    // 当选中行发生变化才会触发
    currentChange(args) {
      // { newValue, oldValue, row, rowIndex, column, columnIndex, $columnIndex, $event }
      // console.log('currentChange...............', args)
      // 更新当前选中行
      this.$emit('update:curRow', args.row)
      // 选中当前列 触发
      this.$emit('currentChange', args)
    },
    // 当前点选即会触发
    cellClick(args) {
      // { row, rowIndex, column }
      // // 更新当前选中行
      // this.$emit('update:curRow', args.row)
      this.$emit('cellClick', args)
    },
    // 可用于父级 通过 ref 获取该实例 手动切换
    toggleCheckboxRowByIndex(index, bool) {
      this.$vxeTable.toggleCheckboxRow(this.list[index])
    },
    // 用于父级 关于 不在当前页的选中数据 处理 删除 使用 $ref[父级定义的key].storageArrRemove()
    storageArrRemove(row) {
      const {
        multipleSelectedKey = 'id'
      } = this.computedOptions
      const index = this.storageArr.findIndex(item => item[multipleSelectedKey] === row[multipleSelectedKey])
      if (index > -1) {
        this.storageArr.splice(index, 1)
      }
    },
    // 当前被选中的列表 进行删除
    /* selectListRemove(row, isCurPageItem) {
      const {
        multipleSelectedKey = 'id',
        multipleSelect
      } = this.computedOptions
      const index1 = this.list.findIndex(item => item[multipleSelectedKey] === row[multipleSelectedKey])
      const vxeTable = this.$vxeTable
      if (!vxeTable) return
      // 如果是单选的话 直接清空
      if (!multipleSelect) {
        return this.$emit('checkboxChange', [])
      }
      if (index1 > -1) {
        return this.toggleCheckboxRowByIndex(index1)
      }
      const _index = this.storageArr.findIndex(item => item[multipleSelectedKey] === row[multipleSelectedKey])
      if (_index > -1) {
        this.storageArr.splice(_index, 1)
        this.$emit('checkboxChange', this.curPageSelect.concat(this.storageArr))
      }
    }, */
    // 列表配置相关操作项方法集合
    refreshHandler() {
      // 默认刷新 param 参数
      this.$emit('update:searchParams', { ...this.searchParams, page: 1 })
      // 额外相关操作
      this.$emit('refreshHandler')
    },
    checkedOptionsChange(options) {
      console.log(options, 'options')
      this.$emit('update:checkedOptions', options)
    },
    closeTipMessage() {
      this.$ls.set(this.tipMessage.localKey, true)
      this.tipMessage_hidden = true
    },
    // 自定义表格行的颜色--表格展开的子级设置为灰色
    customRowBgc({ level }) {
      return level === 0 ? 'parent_row_bgc' : 'sub_row_bgc'
    },
    // 自定义筛选配置 提交
    customSortSubmit(newSearchParams) {
      // 清除排序
      this.$vxeTable.clearSort()
      this.$emit('update:searchParams', newSearchParams)
    }
  }
}
/**
 XTable的 组件配置
 // 需要展示的列配置
 columns = [
 {
        field: 'principalName',
        title: '项目负责人',
        align: 'center',
        width: 100,
        titleHelp: { message: 'titleHelp 测试' }, // 用户提示
        params: {
          // 自定义筛选配置
          sortableOptions: [
            {
              label: '安装版本',
              value: 'first_version'
            },
            {
              label: '最新版本',
              value: 'last_version'
            }
          ],
          // 自定义筛选弹窗组件内部配置
          sortableConfig: {
            // 以下为默认配置
            width: '220px', // 弹窗width配置
            sortKey: 'sort', // 排序 key
            sort_typeKey: 'sort_type', // 排序(升序|降序)类型key
            valueKey: 'value', // sortableOptions 的 valueKey
            labelKey: 'label' // sortableOptions 的 labelKey
          }
          // 如果有多行省略号处理 ellipsis_line
          ellipsis_line: 2 // Number
        }
    },
 {
        field: 'shortendname',
        title: '状态',
        align: 'center',
        width: '160',
        slots: {
          // slots不同类型 scope 关键数据项描述
          // header: '#slotName || render function', // { $columnIndex, $rowIndex, rowIndex, $table, columnIndex, column } // rowIndex 是实际的 index $rowIndex 为虚拟渲染的 index
          // default: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items, row, rowIndex } // items data
          // footer: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items } // items [当前 行 的 内容数据列表] data [所有的footer行数据数组]
          default: 'imageView',
            // header: 'num_footer', // slot 写法
            footer: (args, h) => {
              const { items, _columnIndex } = args
              // 渲染类型1： 使用渲染函数
              // return [
              //   h('vxe-button', {
              //     style: {
              //       color: 'green'
              //     },
              //     on: {
              //     }
              //   }, `[累计]: ${items[_columnIndex]}`)]
              // 渲染类型2： 使用 JSX 渲染/
              return [
                <vxe-button status="primary" size="mini">按钮</vxe-button>,
                <span>累计：{ items[_columnIndex] }</span>
              ]
          }
       }
    }
 ]
 */
/*
<XTable
    :searchParams.sync='searchParams'  请求列表的参数对象({page:1, pageSize: 20})
    :list="list" // 后台请求的列表数据
    :total="total" // 该列表总共有多少数据
    :options='options' // 针对XTable 这个组件本身 自定义 的相关配置
    :tableOptions="tableOptions" // table相关的 配置对象
    :columns="columns" // 需要展示的列配置 // 参考上面的 columns
    :toolsIcon="toolsIcon" // 列表工具栏按钮展示控制数组  ['refresh', 'custom']
    @downloadHandler="downloadHandler" 下载按钮操作函数
    @refreshHandler="refreshHandler" 刷新功能额外操作 (已经内置刷新列表功能 page:1)
    :columnsConfig="columnsConfig" // 自定义配置列表 展示控制 { list_type: 'ListAsinIndex1_test_123456', columnsOptions: []}
    :customColumnsSubmit="customColumnsSubmit" // 从后台获取当前列表的展示配置 对table 进行控制
    @checkboxChange="checkboxChange" // 若存在多选的情况 将目前被选中的数据 传递给父组件
    :selectedList="testList" // 多选情况下 接口返回的元贝备选中的 数组  【有多选数据必传】
    :curRow="testCurRow" // 当前高亮的 数据  【需要高亮上次数据必传】
    // :checkSelectedKey="checkSelectedKey" // 查询当前页面数据是否被选中 筛选的唯一key值 【有多选数据不传默认 为 ‘id'】 todo
/>
*/
</script>
