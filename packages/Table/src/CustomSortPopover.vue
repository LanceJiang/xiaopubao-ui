<!-- 多语言支持 需要调整todo -->
<template>
  <a-popover
    overlayClassName="xpb-custom-sort-popover"
    :trigger="['click']"
    :visible="localVisible"
    @visibleChange="visibleChange"
    placement="bottom">
    <i :class='["xpb-iconfont xpb-custom-sort", localActive ? "active" : ""]'/>
    <template slot="content">
      <div class="xpb-custom-sort-popover-content-wrap" :style='widthStyle'>
        <slot><div class='title'>设置排序条件</div></slot>
        <div class='xpb-custom-sort-popover-content-wrap_content'>
          <!-- 排序条件 -->
          <a-select
            class='local_select'
            allowClear
            v-model='localSort'
            placeholder='请选择'>
            <a-select-option v-for="item of comp_options" :key="item.value" v-bind='item'>
              {{item.label}}
            </a-select-option>
          </a-select>
          <!-- 排序类型 -->
          <a-radio-group
            v-model='localSort_type'
            class='local_radioWrap'
          >
            <a-radio-button value='ASC'>
            升序
            </a-radio-button>
            <a-radio-button value='DESC'>
            降序
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class='footer'>
          <a-button @click="onCancel">取消</a-button>
          <a-button
            type="primary"
            style="margin-left:8px"
            @click="onSubmit">确定</a-button>
        </div>
      </div>
    </template>
  </a-popover>
</template>
<script>
// 自定义 列表排序 popover 弹窗
export default {
  name: 'XCustomSortPopover',
  components: {
  },
  provide () {
    return {
      $formParent: this
    }
  },
  model: {
    prop: 'searchParams',
    event: 'update:searchParams'
  },
  props: {
    // 搜索条件
    searchParams: {
      required: true,
      type: Object
    },
    sortKey: {
      type: String,
      default: 'sort'
    },
    sort_typeKey: {
      type: String,
      default: 'sort_type'
    },
    // 下拉选择 筛选条件
    options: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: String,
      default: '220px'
    }
  },
  data () {
    return {
      localVisible: false,
      localSort: undefined,
      localSort_type: 'ASC', // DESC
      localActive: false
    }
  },
  computed: {
    comp_options() {
      const valueKey = this.valueKey
      const labelKey = this.labelKey
      return (this.options || []).map(option => {
        let value = option
        let label = option
        let disabled = false
        if (typeof option === 'object') {
          value = option[valueKey]
          label = option[labelKey]
          disabled = option.disabled
        }
        return {
          value,
          label,
          disabled
        }
      })
    },
    widthStyle() {
      const width = this.width
      return width ? `width: ${width}` : ''
    }
  },
  watch: {
    searchParams: {
      handler(params) {
        let localActive = false
        if (params) {
          // 原始组件 是  sort, order.toLowerCase()
          // amz系统接口 接口使用是 sort, sort_type
          // others... todo
          let localSort = params[this.sortKey]
          // 如果有 过滤值 但 过滤值不是当前的options 中进行处理
          if (localSort) {
            if (this.comp_options.some(v => v.value === localSort)) {
              localActive = true
            } else {
              localSort = undefined
            }
          }
          const localSort_type = params[this.sort_typeKey]
          this.localSort_type = localSort_type || this.localSort_type
          this.localSort = localSort
          this.localActive = localActive
        }
      },
      immediate: true
    }
  },
  methods: {
    visibleChange(visible) {
      this.$emit('update:visible', visible)
      this.localVisible = visible
    },
    visibleChangeHide() {
      this.visibleChange(false)
    },
    // 默认执行 提交
    onSubmit() {
      const submit = this.$listeners.submit
      const newParams = { ...this.searchParams, [this.sortKey]: this.localSort, [this.sort_typeKey]: this.localSort_type }
      if (submit) {
        this.$emit('submit', newParams)
      } else {
        this.$emit('update:searchParams', newParams)
      }
      this.visibleChangeHide()
    },
    // 默认执行 取消
    onCancel() {
      this.visibleChangeHide()
    },
    // provide 子组件使用 todo
    cancelHandler() {
      // 取消
      this.visibleChangeHide()
    },
    submitHandler() {
      // 确认
      this.visibleChangeHide()
    }
  }
}
</script>
