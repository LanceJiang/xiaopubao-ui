<template>
  <div class="flex-column-page-wrap pageWrap">
    Home
    <div class="common_title">iconfont && XIcon</div>
    <div class="content">
      <!--  单色样式类  -->
      <span class="xpb-iconfont xpb-yichang"></span>
      <XIcon iconClass="xpb-diyiming"></XIcon>
      <span class="xpb-iconfont xpb-no-data"></span>
      <!--  svg  -->
      <XIcon iconClass="xpb-no-data" @click="test"></XIcon>
      <!--Table 操作 用： Icon按钮-->
      <a-button class="xpb-icon-button" @click="test('row')">
        <XIcon iconClass="xpb-no-data"></XIcon>
      </a-button>
    </div>
    <div class="common_title">暂无数据 XNoData</div>
    <div class="content">
      <XNoData
        @click="$log('test....')"
        isFull
      >
<!--        message="<div style='background: #f00;'>test: others</div>"-->
        <template v-slot:extraContent>extraContent: no data</template>
      </XNoData>
    </div>

    <div class="common_title">XInputNumber && XInputNumberRange</div>
    <div class="content">
      {{testNumber}}
      <XInputNumber v-model="testNumber" />
      <XInputNumber disabled v-model="testNumber" :min="0" addonBefore="#"></XInputNumber>
      <XInputNumber v-model="testNumber" :min="0" addonBefore="#" size="small"></XInputNumber>
      <XInputNumber v-model="testNumber" :min="0" addonBefore="#" addonAfter="￥"></XInputNumber>
      <div style='background: #f00;height: 2px;'></div>
      {{testNumberRangeParams}}
      <XInputNumberRange
        addonBefore="前缀"
        addonAfter="后缀"
        v-model="testNumberRangeParams"
        v-bind="numberRangeForm"
        @change="inputNumberRangeChange"
        @pressEnter="inputNumberRangePressEnter"
      ></XInputNumberRange>
      <XInputNumberRange
        v-model="testNumberRangeParams"
        v-bind="numberRangeForm"
        @change="inputNumberRangeChange"
        @pressEnter="inputNumberRangePressEnter"
      >
        <template #addonAfter>
          <a-select
            v-model="testNumberRangeParams.testSelect"
            style="width: 100px;"
            placeholder="Select a person"
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
          </a-select>
        </template>
      </XInputNumberRange>
    </div>
<!--

    <div class="common_title">下拉Dropdown XDropdown</div>
    <div class="content">
      <XDropdown v-model="dropdownValue" :options="dropdownOptions" clearable modelValue>
&lt;!&ndash;        <template #btn="{ selectOption, showClear }">
          <span class="xpb-dropdown-link">
            {{$log(showClear, 'showClear')}}
            {{selectOption.label}}
             <i :class="['action a-icon-arrow-down']" />
          </span>
        </template>&ndash;&gt;
      </XDropdown>

      <XDropdown v-model="dropdownValue" :options="dropdownOptions" @command="$log($event, 'command 测试')">
        <template #btn="test">
          <span class="xpb-dropdown-link">
            {{test}}
             <i :class="['action a-icon-arrow-down']" />
          </span>
        </template>
        <template slot="options">
          <a-dropdown-item
            v-for="opt in dropdownOptions"
            :key="opt.value"
            :command="opt.value"
            :disabled="opt.disabled"
          >
            -&#45;&#45;{{ opt.label }}&#45;&#45;&#45;&#45; label
          </a-dropdown-item>
        </template>
      </XDropdown>
    </div>
    <div class="common_title">XDraggableNest</div>
    <div class="content">
      <XDraggableNest
        style="background: #fafafa;"
        v-model="checkedOptions"
        :move="onMove"
      />
    </div>-->
    <div class="common_title">iconfont && XIcon</div>
    <div class="content">

    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      checkedOptions: [
        {
          label: 'Normal',
          prop: 'Normal'
        },
        {
          label: `test_children`,
          prop: 'test_children',
          children: [
            {
              label: 'child0_001',
              prop: 'child0_001'
            },
            {
              label: 'child0_002',
              prop: 'child0_002'
            }
          ]
        },
        {
          label: `orderNo`,
          prop: 'orderNo'
        },
        {
          // 多语言
          t_label: `xpb.table.action`,
          prop: 'action',
          fixed: 'right'
        }
      ],
      testNumber: 1,
      testNumberRangeParams: {
        numberRangeStart: 2,
        numberRangeEnd: 4,
        otherXXX: 666,
        testSelect: undefined
      },
      numberRangeForm: {
        prop: 'numberRange', // (numberRangeStart,  numberRangeEnd)
        // propStart: 'numberRange__min',
        // propEnd: 'numberRange__max'
        addonAfterVisible: true
      },
      testDrawer: false,
      searchParams: {
        radio: undefined,
        input: 'testInput',
        adSelectMultiple: ['选项1'],
        adSelectMultipleMore: ['选项2']
      },
      formOptions: {
        // 调整是否 isMore todo... 交互
        forms: [
          {
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
            prop: 'adSelect', // 提交的 params 的字段
            label: 'adSelect', // label 标签
            itemType: 'adSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMore', // 提交的 params 的字段
            label: 'adSelectMore', // label 标签
            itemType: 'adSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMultiple', // 提交的 params 的字段
            label: 'adSelectMultiple', // label 标签
            itemType: 'adSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMultipleMore', // 提交的 params 的字段
            label: 'adSelectMultipleMore', // label 标签
            itemType: 'adSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          /* { // 可用于特殊场合中 但不支持 tagList   （支持 替代  iconTip itemType 类型）
            // showLabel: true,
            prop: 'render',
            label: '自定义Render',
            itemType: 'render',
            // change(...args) {
            //   console.error(...args, 'change...')
            // },
            // render: (h, extendsParams) => {
            //   const { form, params } = extendsParams
            //   return <a-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
            // } // todo....
            render: (h, extendsParams) => {
              // const { form, params } = extendsParams
              return <div class="icon-button-box">
                <a-tooltip>
                  <template slot="title">
                    <span domPropsInnerHTML={ '说明：<br/>' +
                      '1、分时统计：根据选择的日期范围统计每个小时的数据汇总。<br/>' +
                      '2、按周分时统计：根据选择的日期范围统计星期的数据汇总。<br/>' +
                      'eg：选择日期范围为30天，30天约等于4周。下拉选项选择“星期一”，1个月共4个星期一，系统将每个星期一的数据进行汇总统计。<br/>' +
                      '3、按日分时统计：根据选择的日期范围统计每个小时的数据。<br/>' +
                      '4、按周统计：周一到周日维度的统计<br/>' +
                      '5、按月统计：1月~12月维度的统计' }></span>
                  </template>
                  <i class='iconfont icon-question'/>
                </a-tooltip>
              </div>
            }
          }, */
          /* {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          }, */
          // {
          //   prop: 'rangePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
          //   label: 'rangePicker(对应a-range-picker)',
          //   itemType: 'rangePicker',
          //   calendarChange: (dates) => {
          //     console.log(dates, 'test onCalendarChange')
          //   }
          // },
          /* {
            // showLabel: true,
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'dateRange', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'rangePicker(对应a-range-picker2)',
            itemType: 'rangePicker'
          },
          {
            prop: 'datePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'datePicker',
            itemType: 'datePicker',
            change(params, options, isMore) {
              // // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
              // that.searchParams2.rangePicker = undefined // 测试only
              // console.log(params, options, isMore, 'value, options, isMore')
            }
          },
          {
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'datePicker2', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'datePicker2',
            itemType: 'datePicker'
          },

          {
            prop: 'monthPicker',
            label: 'monthPicker',
            itemType: 'monthPicker'
          },
          {
            prop: 'inputNumber',
            label: 'inputNumber',
            itemType: 'inputNumber',
            change: (val) => {
              console.log('inputNumber   change.....', val)
            }
          }, */
          // {
          //   isMore: true, // 只要不为true 就是 默认展示
          //   prop: 'inputNumber2',
          //   label: 'inputNumber2',
          //   itemType: 'inputNumber'
          // },
          {
            prop: 'radio',
            label: 'radio',
            itemType: 'radio',
            showLabel: true,
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
            showLabel: true,
            options: [
              { value: 10, label: '1未结算' },
              { value: 11, label: '1已结算' },
              { value: 12, label: '1全部' }
            ],
            change: (val) => {
              console.log('radio   change.....', val)
            }
          }
          /* {
            // isMore: true, // 只要不为true 就是 默认展示
            // showLabel: true,
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
          } */
          // 复合类型_【下拉+rangePicker】 注：  【替代： SearchInfo timeSelect 类型】
          /* { // 复合类型 todo...
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
          }, */
          /* // 复合类型_【下拉+input】 注：  【替代： SearchInfo textSelect 类型】
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
          }, */
        ]
      },
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value: '选项' + i,
          label: '黄金糕' + i
        }
      }),
      testValue: undefined,
      testValue2: ['选项0', '选项1', '选项2'],
      dropdownValue: undefined,
      dropdownOptions: [
        {
          label: 'in',
          value: 0
        },
        {
          label: 'cm',
          value: 1
        }
      ]
    }
  },
  watch: {
    searchParams(params) {
      console.error(params, 'searchParams 更新...')
    }
  },
  methods: {
    inputNumberRangeChange(val, propKey) {
      console.error(val, propKey, 'inputNumberRangeChange val, propKey')
    },
    inputNumberRangePressEnter(e, propKey) {
      console.error(e, propKey, 'inputNumberRangePressEnter e, propKey')
    },
    test() {
      console.error('test...')
    },
    switchLang() {
      let lang = this.$i18n.locale
      if (lang === 'en') {
        lang = 'zh'
      } else {
        lang = 'en'
      }
      this.$i18n.locale = lang
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // fixed 表示 固定的项
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    }
  }
}
</script>
<style lang="less" scoped>
.pageWrap {
  padding: 10px 12px;
  overflow: auto;
}

</style>
