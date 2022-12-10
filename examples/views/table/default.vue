<template>
  <div class="flex-column-page-wrap pageWrap">
    <XTable
      class="local_table"
      :class='`cellHeightWrap_${cellHeightWrap}`'
      :searchParams.sync="searchParams"
      :list="localList"
      :total="total"
      :options="options"
      :tableOptions="tableOptions"
      :columns="localColumns"
      :checkedOptions.sync="checkedOptions"
      :columnsConfig="curColumnsConfig"
      @update:checkedOptions='updateCheckedOptions'
    >
      <template #toolLeft>
<!--        <XSearchFormModel/>-->
        <x-search-form-model
          v-bind="formOptions"
          v-model="formParams"
          :deleteTag="deleteTag">
        </x-search-form-model>
<!--        <a-input
          class="xpb-input-search"
          v-model="formParams.pattern"
          size="default"
          :placeholder="$t('outboundOrder.filter.pattern.placeholder')"
          clearable
          @keyup.enter.native="updateParams"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="updateParams"/>
        </a-input>-->
      </template>
      <template #top>
        <!-- 按钮集合 -->
        <div class="xpb-button-wrap">
          <template v-if="true">
            <a-tooltip
              placement="top"
              :content="$t('outboundOrder.btn.CreateBatchTip')"
            >
              <a-button
                type="primary"
                :class="{ 'is-disabled_test': true }"
              >
                {{ $t('outboundOrder.btn.CreateBatch') }}
              </a-button>
            </a-tooltip>

            <a-button
              style="margin-right: 10px"
            >
              {{ $t('outboundOrder.btn.BulkPicking') }}
            </a-button>
          </template>
<!--          :disabled="!selectList.length"-->
          <a-dropdown>
            <a-button>
              {{ $t('outboundOrder.btn.Print') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a-button>
            <a-dropdown-menu slot="dropdown">
              <a-dropdown-item v-for="v of dropdownList" :key="v" :command="v">
                {{ $t(`outboundOrder.btn.${v}`) }}
              </a-dropdown-item>
            </a-dropdown-menu>
          </a-dropdown>
        </div>
      </template>
<!--      <template #top>
        我是 top... todo
      </template>-->
      <!-- 自定义slot title -->
      <template #slotName_title>
        <a-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
          <span>slotName_title</span>
        </a-tooltip>
      </template>
      <!-- 操作 -->
      <template #action="{ row }">
        <a-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
          <a-button class="xpb-icon-button" @click="handleView(row)">
            <XIcon icon-class="xpb-jingpinfenxi"></XIcon>
          </a-button>
        </a-tooltip>
        <a-button class="xpb-icon-button">
          <XIcon icon-class="xpb-fuzhi"></XIcon>
        </a-button>
      </template>
    </XTable>
  </div>
</template>

<script>
import { getOrders, getOrdersCount, getTableConfig } from './queryApi'

import { columns, checkedOptions, defaultCheckedOptions } from './default_config'

export default {
  name: 'default',
  components: {
  },
  data() {
    return {
      cellHeightWrap: '',
      formParams: {
        render: 'testXXX',
        pattern: 'input 搜索',
        input: 'testInput',
        xSelect: '选项1',
        xSelectMore: '选项2',
        xSelectMultiple: ['选项3'],
        xSelectMultipleMore: ['选项4'],
        radio: 0,
        inputMore: 'inputMore_init',
        rangePicker: ['2022-11-10', '2022-11-25'],
        rangePickerMore: [],
        datePickerMore: '2022-11-25'
        // inputNumber: undefined
      },
      searchParams: {
        page: 1,
        pageSize: 20,
        sort_type: undefined,
        sort: undefined
      },
      formOptions: {
        // a-form-model 相关配置
        formModelConfig: {
        },
        // popWidth: '400px', // 更多的弹窗 width
        forms: [
          /* {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'input', // 提交的 params 的字段
            label: 'input', // label 标签
            itemType: 'input' // form-item 类型
            // prepend: 'Http://', // 额外form-item配置
            // append: '.com' // 额外form-item配置
            // placeholder: '请输入input..............' // 额外form-item配置
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'inputMore', // 提交的 params 的字段
            label: 'inputMore', // label 标签
            itemType: 'input' // form-item 类型
            // prepend: 'Http://', // 额外form-item配置
            // append: '.com' // 额外form-item配置
          },
          {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'xSelect', // 提交的 params 的字段
            label: 'xSelect', // label 标签
            itemType: 'xSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: 'xSelect单选' + i
              }
            }),
            // slot template（$scopedSlots）  方式1
            slotOption: 'xSelectSlot'
            // slot function 方式2
            // slotOption(h, { option, label }) {
            //   return label + '_____'
            // }
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'xSelectMore', // 提交的 params 的字段
            label: 'xSelectMore', // label 标签
            itemType: 'xSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: 'xSelectMore单选' + i
              }
            })
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'xSelectMultiple', // 提交的 params 的字段
            label: 'xSelectMultiple', // label 标签
            itemType: 'xSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: 'xSelect多选' + i
              }
            })
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'xSelectMultipleMore', // 提交的 params 的字段
            label: 'xSelectMultipleMore', // label 标签
            itemType: 'xSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: 'xSelectMore多选' + i
              }
            })
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          }, */
          {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'rangePicker', // 提交的 params 的字段
            label: 'rangePicker', // label 标签
            itemType: 'rangePicker', // form-item 类型
            change(params, options, isMore) {
              // // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
              // that.searchParams2.rangePicker = undefined // 测试only
              console.log(params, options, isMore, 'value, options, isMore')
            }
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'rangePickerMore', // 提交的 params 的字段
            label: 'rangePickerMore', // label 标签
            itemType: 'rangePicker' // form-item 类型
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'datePicker', // 提交的 params 的字段
            label: 'datePicker', // label 标签
            itemType: 'datePicker' // form-item 类型
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'datePickerMore', // 提交的 params 的字段
            label: 'datePickerMore', // label 标签
            itemType: 'datePicker' // form-item 类型
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'monthPicker', // 提交的 params 的字段
            label: 'monthPicker', // label 标签
            itemType: 'monthPicker' // form-item 类型
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'monthPickerMore', // 提交的 params 的字段
            label: 'monthPickerMore', // label 标签
            itemType: 'monthPicker' // form-item 类型
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'inputNumber', // 提交的 params 的字段
            label: 'inputNumber', // label 标签
            itemType: 'inputNumber', // form-item 类型
            addonBefore: '展示前缀',
            // addonAfter: '展示后缀',
            itemWidth: '190px',
            change: (val) => {
              console.log('inputNumber   change.....', val)
            }
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'inputNumberMore', // 提交的 params 的字段
            label: 'inputNumberMore', // label 标签
            itemType: 'inputNumber', // form-item 类型
            addonAfter: '展示后缀'
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'select', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
          },
          {
            prop: 'radio',
            label: 'radio',
            itemType: 'radio',
            options: [
              { value: 0, label: '未结算' },
              { value: 1, label: '已结算' },
              { value: 2, label: '全部' }
            ],
            change: (val) => {
              console.log('radio   change.....', val)
            }
          },
          {
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'radioMore',
            label: 'radioMore',
            itemType: 'radio',
            options: [
              { value: 10, label: '1未结算' },
              { value: 11, label: '1已结算' },
              { value: 12, label: '1全部' }
            ],
            change: (val) => {
              console.log('radio   change.....', val)
            }
          },
          { // 可用于特殊场合中 tagList 需要结合tagRender 做支持
            prop: 'render',
            label: '自定义Render',
            itemType: 'render',
            render: (h, extendsParams) => {
              const { form, params } = extendsParams
              return <div style="background: #f0f;">
                <a-input v-model={params[form.prop]} placeholder="placeholder render"/>
              </div>
              // <a-input v-model={params.others} placeholder="placeholder others"/>
            },
            // todo...
            tagRender(h, { searchParams, transLabel, deleteFn }) {
              console.error(searchParams, transLabel, deleteFn, 'searchParams, label, value')
              const render = searchParams['render'] || ''
              const others = searchParams['others']
              let showValue = render
              if (others) {
                showValue += (showValue ? '-and-' : '') + others
              }
              let tag = ''
              if (showValue) {
                tag = <a-tag disable-transitions>
                  {`${transLabel}：`}
                  {showValue ? `<span class="el-tag__label">${showValue}</span>` : ''}
                  {others ? `others：<span class="el-tag__label">${showValue}</span>` : ''}
                  <i class="icon-delete" onClick={deleteFn} />
                </a-tag>
              }
              return {
                showValue,
                tag
              }
            }
          },
          {
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
            // propStart: 'inputNumberRange_start',
            // propEnd: 'inputNumberRange_end',
            label: 'inputNumberRange',
            itemType: 'inputNumberRange',
            placeholderStart: 'xxxx最小值',
            placeholderEnd: 'xxxx最大值',
            change(params, _options, isMore, propKey) {
              console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
            }
          },
          // 复合类型_【下拉+rangePicker】 注：  【替代： SearchInfo timeSelect 类型】
          { // 复合类型 todo...
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_label',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&rangePicker_select',
                label: 'compact_select&rangePicker_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                itemWidth: '90px'
                // placeholder: '请选择select'
              },
              {
                prop: 'compact_select&rangePicker_rangePicker',
                label: 'compact_select&rangePicker_rangePicker',
                itemType: 'rangePicker',
                calendarChange: (dates) => {
                  console.log(dates, 'test compact_select&rangePicker_ onCalendarChange')
                }
              }
            ]
          },
          // 复合类型_【下拉+input】 注：  【替代： SearchInfo textSelect 类型】
          {
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_select&input',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&input_select',
                label: 'compact_select&input_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                allowClear: false,
                itemWidth: '90px'
              },
              {
                prop: 'compact_select&input_input', // 提交的 params 的字段
                label: 'compact_select&input_input', // label 标签
                itemType: 'input',
                itemWidth: '190px',
                placeholder: '支持模糊搜索'
              }
            ]
          },
          // 复合类型_【下拉+inputNumberRange】 注：  【替代： SearchInfo inputGroupSelect 类型】
          {
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_select&inputNumberRange',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&inputNumberRange_select',
                label: 'compact_select&inputNumberRange_select',
                itemType: 'select',
                options: [
                  { value: 'impressions', label: '曝光量(Imp)' },
                  { value: 'clicks', label: '点击量(Clicks)' },
                  { value: 'ctr', label: 'CTR(%)' },
                  { value: 'order_proportion', label: '广告订单占比(%)' }
                ],
                // showSearch: true,
                itemWidth: '90px',
                itemStyle: 'min-width: 90px;' // 组合后 由于设置了 display: flex 导致 width auto 缩小
              },
              {
                prop: 'compact_select&inputNumberRange_inputNumberRange', // 提交的 params 的字段
                label: 'compact_select&inputNumberRange_inputNumberRange', // label 标签
                itemType: 'inputNumberRange',
                placeholder: '支持模糊搜索',
                change(params, _options, isMore, propKey) {
                  console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
                }
              }
            ]
          }
        ]
      },
      list: [],
      total: 0,
      options: {
        // rowKey: 'value',
        loading: false,
        // showIndex: true,
        multipleSelect: true,
        pageSizes: [20, 500, 1000, 5000, 10000, 50000, 100000]
      },
      tableOptions: {
        // 虚拟滚动 模式配置 (建议使用)
        scrollY: { mode: 'wheel' }
      },
      dropdownList: ['PickingList', 'PackingList'],
      // 列配置对象
      curColumnsConfig: {
        // 所有的 columns 配置
        columns,
        // 默认展示配置
        defaultCheckedOptions
      },
      checkedOptions: JSON.parse(JSON.stringify(checkedOptions)),
      // todo  后续 对于新增的搜索类型可能有需要参照用到
      filterOptions: [
        {
          label: 'Test',
          key: 'test',
          type: 'radio',
          // slot: 'checkbox',
          options: [
            { label: 'test', value: 'test' },
            { label: 'UPS', value: 'abc' },
            { label: 'Pitnet Bowers', value: 'PB' }
          ],
          is_hide: true
        },
        {
          label: 'Checkbox',
          key: 'Checkbox',
          type: 'checkbox',
          // is_hidden_selectAll: true,
          // slot: 'checkbox',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: '1' }
          ]
        },
        {
          label: 'Amount Range',
          key: 'Amount',
          type: 'amount-range',
          date_options: {
            min: 0,
            max: 1
          }
        },
        {
          label: 'Number Range',
          key: 'Number',
          type: 'number-range',
          date_options: {
            min: -1,
            max: 0
          }
        },
        {
          label: 'Picker',
          key: 'Picker',
          type: 'date-picker',
          date_options: {
            type: 'daterange'
          }
        },
        {
          label: 'Select',
          key: 'Select',
          type: 'select',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' }
          ],
          is_button: true
        },
        {
          label: 'Radio',
          key: 'Radio',
          type: 'radio',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' },
            { label: 'Fedex', value: 'FEDEX1' },
            { label: 'UPS', value: 'UPS1' },
            { label: 'Pitnet Bowers', value: 'PB1' },
            { label: 'STAMPS', value: 'STAMPS1' },
            {
              label: 'Range',
              value: 'Range',
              date_options: {
                min: -99999,
                max: 99999
              },
              range_data: this.radio_data, // 范围的数据
              range: true
            }
          ],
          is_button: true
        },
        {
          label: '1234',
          key: '1234567',
          type: 'radio',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' },
            { label: 'Fedex', value: 'FEDEX1' },
            { label: 'UPS', value: 'UPS1' },
            { label: 'Pitnet Bowers', value: 'PB1' },
            { label: 'STAMPS', value: 'STAMPS1' },
            {
              label: 'Range',
              value: 'Range',
              date_options: {
                min: -99999,
                max: 99999
              },
              range_data: this.radio_data, // 范围的数据
              range: true
            }
          ],
          is_button: true
        }
      ]
    }
  },
  computed: {
    localList() {
      // 相关数据组装处理
      return this.list
    },
    localColumns() {
      // 为保险起见 拿到接口的配置数据 需要过滤 已失效的配置项 todo... [checkedOptions]
      const { checkedOptions } = this
      const columns = this.curColumnsConfig.columns
      if (!checkedOptions.length) return columns
      return checkedOptions.map((v) => {
        const cur = columns.find((column) => column.prop === v.prop)
        if (cur) {
          const fixedFlag = cur.fixed
          if (fixedFlag) {
            v.fixed = fixedFlag
          }
          return cur
        }
        return false
      }).filter(Boolean)
    }
  },
  watch: {
    // 监听数据对象变更 重新做请求
    searchParams() {
      // searchParams 变更 重新做请求
      this.queryList()
    },
    // 更新formParams
    formParams: 'updateParams',
    localColumns(columns) {
      if (columns.find(v => v.field === 'value')) {
        this.cellHeightWrap = 'value'
        return
      }
      if (columns.find(v => v.field === 'action')) {
        this.cellHeightWrap = 'action'
        return
      }
      return 'default'
    }
  },
  created() {
    window.test = this
    this.queryTableConfig()
    this.updateParams()
    // this.queryList()
  },
  updated() {
    console.warn(columns, 'columns')
  },
  methods: {
    updateParams() {
      console.error(JSON.stringify(this.formParams), 'updateParams  去请求接口 todo....')
      this.searchParams = {
        ...this.searchParams,
        ...this.formParams,
        page: 1
      }
    },
    getRequestParams(e) {
      // console.error('getRequestParams', e)
      return {
        ...this.searchParams,
        ...this.formParams
      }
    },
    updateCheckedOptions(options) {
      console.error(options)
      // todo columns 选中值进行提交
      this.$message.success('列表自定义配置成功~')
    },
    // table配置请求
    queryTableConfig() {
      // 可能存在多个 table 配置 此处制作一个进行模拟
      return getTableConfig().then((res) => {
        // 对失效的 配置做剔除 todo
        let checkedOptions = res.columns
        const { columns, defaultCheckedOptions } = this.curColumnsConfig
        /** defaultCheckedOptions 必须与columns 配置修改做 同步更新 */
        if (!Array.isArray(checkedOptions) || !checkedOptions.length) {
          checkedOptions = defaultCheckedOptions
        }
        // 对之前接口存储的 checkedOptions 做过滤更新（必要的处理）
        for (let i = 0; i < checkedOptions.length; i++) {
          const option = checkedOptions[i]
          const column = columns.find((_column) => option.prop === _column.prop)
          if (!column) {
            // 删除上次保存的无效column配置
            checkedOptions.splice(i, 1)
            i--
          } else if (option.t_label !== column.t_label) {
            // 以columns的配置 更新最新 t_label 保证 ColumnsPopover 展示的选中值 和 最新的columns 名称一致
            option.t_label = column.t_label
          }
        }
        // this.checkedOptions = res.columns
        console.log(checkedOptions, 'checkedOptions.....')
        this.checkedOptions = checkedOptions

        // todo searchForms todo....
      })
    },
    // 列表请求
    queryList() {
      this.options.loading = true
      const input = this.getRequestParams()
      console.warn('input', JSON.stringify(input))
      const p1 = getOrders(input).then((list) => {
        this.list = list
      })
      const p2 = getOrdersCount(input.filter).then((total) => {
        this.total = total
      })
      Promise.all([p1, p2])
        .catch((e) => {
          this.$message.error(e.response?.errors?.[0].message)
        })
        .finally(() => {
          this.options.loading = false
        })
    },
    // 目前删除只针对 标签删除(未兼容 popoverItem 和 moreItem 的 clear)
    deleteTag(form, searchParams) {
      console.log('deleteTag ', form, searchParams)
      if (form.prop === 'render') {
        // 额外处理逻辑
        searchParams.others = ''
        // searchParams.render = 'render reset.........'
      }
    }
  }
}
</script>

<style scoped lang="less">
//.pageWrap {
//  overflow: auto;
//}
// 其他样式
.local_table {
  padding: 0 12px;
}
.cellHeightWrap{
  &_value {
    ::v-deep {
      .vxe-table--body .vxe-cell {
        //height: 32 + 22;
        height: 54px;
        min-height: 54px !important;
      }
    }
  }
  &_action {
    ::v-deep {
      .vxe-table--body .vxe-cell {
        //height: 32 + 22;
        height: 32px;
        min-height: 32px !important;
      }
    }
  }
}
</style>
