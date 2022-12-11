<template>
  <div :class="['xpb-select', disabled ? 'xpb-select-disabled' : '']">
    <a-dropdown
      overlayClassName='ecSelect_localPopoverWrap'
      placement='bottomLeft'
      v-model='visible'
      :trigger="['click']"
      :disabled='disabled'
    >
      <div ref='ecSelectBox' :class="['xpb-select_box', visible ? 'xpb-select_box--open' : '']" :style='{width}'>
        <div v-show='selectLabel.length<=0' class='xpb-select_placeholder'>{{ placeholder }}</div>
        <template v-if='multiple'>
          <div v-show='selectLabel.length>0' class='xpb-select_tag'>
            <template v-for='(item,i) in selectLabel'>
              <a-tag v-if='i<=tagLength-1' :key='i' :title='item' class='text-overflow_ellipsis'>{{ item }}</a-tag>
            </template>
            <a-tag class='text-overflow_ellipsis' v-if='selectLabel.length>tagLength'>+{{ selectLabel.length - tagLength
              }}...
            </a-tag>
          </div>
        </template>
        <!-- 单选 -->
        <template v-else>
          <div v-show='selectLabel.length>0' class='xpb-select_tag'>
            <div :title='selectLabel' class='text-overflow_ellipsis'>
              {{ selectLabel }}
            </div>
          </div>
        </template>
        <div :class='{has_allowClear: allowClear}' class='xpb-select_operate'>
          <span :class="['xpb-select_arrows', selectLabel.length ? 'show' : '']">
            <a-icon type='down' />
          </span>
          <span class='xpb-select_clear' v-show='selectLabel.length' @click.stop='handleClearAll'>
            <a-icon type='close-circle' theme='filled' />
          </span>
        </div>
      </div>
      <div class='xpb-select_content' slot='overlay' :style='{width: local_overlayWidth}'>
        <template v-if='!options.length'>
          <NoData size='mini' />
        </template>
        <template v-else>
          <div class='xpb-select-search'>
            <a-input ref='searchInput' :value='searchTxt' @keyup='searchTxtInput' placeholder='搜索' type='text'
                     auto-focus>
              <a-icon slot='suffix' type='search' style='color: rgba(0,0,0,.45)' />
            </a-input>
          </div>
          <div v-if='!computedOptions.length' class='xpb-select-search-none'>
            无搜索结果
          </div>
          <template v-else>
            <!-- 仅在 多选情况下生效 -->
            <div v-if='multiple' v-show='computedOptions.length' class='xpb-select_list_item'>
              <a-checkbox :checked='isAll' @change='checkAllHandler'>全选</a-checkbox>
            </div>
            <!--     28 * 8 -> 224 -->
            <vxe-list :height='computedOptions.length > 8 ? "224" : "auto"' class='xpb-select_list'
                      :scrollY='{gt: 10}'
                      :data='computedOptions'>
              <template #default='{ items }'>
                <!-- 多选 -->
                <template v-if='multiple'>
                  <div
                    class='xpb-select_list_item text-overflow_ellipsis'
                    v-for='(item, idx) in items'
                    :key='idx'
                    :title='item[labelKey]'
                    :data-id='item[valueKey]'
                  >
                    <!--                      <span slot="label" slot-scope="{ value }" style="color: red">{{ value }}</span>-->
<!--                    <span #label="{ value }" style="color: red">{{ value }}</span>-->
                    <a-checkbox
                      :checked='selected_value.includes(item[valueKey])'
                      @change='e =>onCheckboxChange(e, item[valueKey])'
                    >
<!--                      {renderSelectOption.call(this, form.slotOption, option, label)}-->
                      {{ item[labelKey] }}
                    </a-checkbox>
                  </div>
                </template>
                <!-- 单选 -->
                <template v-else>
                  <a-radio-group class='xpb-select_radioWrap' v-model='selected_value' @change='submitHandler'>
                    <a-radio
                      class='xpb-select_list_item text-overflow_ellipsis'
                      v-for='(item, idx) in items'
                      :key='idx'
                      :title='item[labelKey]'
                      :value='item[valueKey]'>
                      {{ item[labelKey] }}
                    </a-radio>
                  </a-radio-group>
                </template>
              </template>
            </vxe-list>
          </template>
          <div v-if='multiple' class='xpb-select_footer' :class="{'shadow': footerShadow}">
            <a-button size='small' @click='cancelHandler' style='margin-right:8px'>取消</a-button>
            <a-button size='small' @click='submitHandler' type='primary'>确定</a-button>
          </div>
        </template>
      </div>
    </a-dropdown>
  </div>
</template>
<script>
import { debounce } from 'xiaopubao-ui/src/utils/index'
import { renderSelectOption } from 'xiaopubao-ui/src/utils/slotsUtils'
import NoData from 'xiaopubao-ui/packages/NoData'
console.log(renderSelectOption, 'renderSelectOption 自定义渲染')
const initSelectedHandler = (_this) => {
  // 多选 || 单选
  if (_this.multiple) {
    _this.selected = []
    _this.selected_value = []
    _this.selected_label = []
  } else {
    _this.selected = undefined
    _this.selected_value = undefined
    _this.selected_label = ''
  }
}
export default {
  name: 'XSelect',
  components: {
    NoData
  },
  props: {
    // 数据支持 数组 或 单个数据
    value: {
      // type: [String, Number, Array],
    },
    multiple: Boolean,
    allowClear: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '150px'
    },
    // 覆盖弹窗层宽度
    overlayWidth: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      required: true,
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    prop: {
      type: String,
      default: ''
    },
    tagLength: {
      type: Number,
      default: 1
    },
    footerShadow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      searchTxt: '', // 搜索词
      // selected: [], // 临时存储
      // localOptions: [], // 所有选项
      selected_value: [],
      selected_label: []
    }
  },
  computed: {
    local_overlayWidth() {
      return this.overlayWidth || this.width
    },
    // 页面显示的文本
    selectLabel() {
      const { selected_label, value, multiple } = this
      // console.log(selected_label, 'selected_label    value', value)
      if (multiple) {
        // 若取得到 selected_label 则展示对应的label 取不到则 使用 value 作为展示
        return value ? (selected_label.length ? selected_label : value) : []
      }
      return value ? (selected_label !== '' ? selected_label : value) : ''
    },
    // 是否全选
    isAll() {
      const { options, computedOptions, selected_value, valueKey } = this
      const showVals = computedOptions.map(v => v[valueKey])
      return options.length > 0 && selected_value.length > 0 && showVals.every(v => selected_value.includes(v))
    },
    // 页面展示数据（options是所有数据）
    computedOptions() {
      // console.log(this.options, 'options   get computedOptions..........')
      return this.options.filter(v => this.checkItem(v))
    }
  },
  created() {
    // 初始化选中
    initSelectedHandler(this)
  },
  watch: {
    visible(val) {
      val && this.$nextTick().then(_ => {
        (this.$refs.searchInput || {
          focus: () => {
          }
        }).focus()
      })
    },
    value: {
      immediate: true,
      handler(newVal) {
        // console.log('value newVal', this.labelKey, newVal)
        // 更新  选中项目 并且 触发更新 tagsList
        this.setSelected()
        this.$emit('update:selected_label', this.selected_label)
      }
    },
    options: {
      // immediate: true,
      // deep: true,
      handler(newVal) {
        // 默认展示
        this.setSelected()
        this.$emit('update:selected_label', this.selected_label)
      }
    }
  },
  methods: {
    updateSelectHandler() {
      this.$emit('input', this.selected_value)
      this.$emit('update:selected_label', this.selected_label)
      this.$emit('update:selected', this.selected)
      this.$nextTick(() => {
        this.$emit('change', this.selected_value) // v-decorator 自定义操作必须
        // this.$emit('change', {
        //   value: this.selected_value,
        //   label: this.selected_label,
        //   selected: this.selected
        // })
      })
    },
    // 确定
    submitHandler() {
      this.setSelected(this.selected_value)
      this.updateSelectHandler()
      this.cancelHandler()
    },
    // 取消
    cancelHandler() {
      this.visible = !this.visible
    },
    // 全选与反选
    checkAllHandler() {
      const codes = this.computedOptions.map(v => v[this.valueKey])
      if (this.isAll) {
        // 取消全选
        this.selected_value = this.selected_value.filter(v => !codes.includes(v))
      } else {
        // 全选
        this.selected_value = [...new Set(this.selected_value.concat(codes))]
      }
    },
    // 清除全部
    handleClearAll() {
      // 初始化
      initSelectedHandler(this)
      this.updateSelectHandler()
    },
    // 监听单个复选框变化
    onCheckboxChange(e, value) {
      if (e.target.checked) {
        // 选中
        this.selected_value.push(value)
      } else {
        // 取消选中
        const idx = this.selected_value.indexOf(value)
        this.selected_value.splice(idx, 1)
      }
    },
    // 检测单个checkbox是否选中
    checkItem(item) {
      const { searchTxt, labelKey } = this
      // option 的 visible 作为隐藏 配置
      if (item.visible === false) return false
      if (!searchTxt) return true
      const low_text = searchTxt.toLowerCase() // 转小写
      const low_item = (item[labelKey] || '').toLowerCase()
      return low_item.includes(low_text)
    },
    searchTxtInput: debounce(function(e) {
      this.searchTxt = e.target.value.trim()
    }, 150),
    setSelected(value = this.value) {
      const { valueKey, labelKey } = this
      const getItem = (val) => {
        return this.options.find(v => {
          if (v[valueKey] === val) {
            return true
          }
        })
      }
      // 单选
      if (!this.multiple) {
        const option = getItem(value)
        if (option) {
          this.selected = option
          this.selected_value = option[valueKey]
          this.selected_label = option[labelKey]
        } else {
          this.selected = undefined
          this.selected_value = undefined
          this.selected_label = ''
        }
        return
      }
      const selected = []
      if (Array.isArray(value)) {
        value.map(val => {
          const option = getItem(val)
          if (option) {
            selected.push(option)
          }
        })
      }
      this.selected = selected
      this.selected_value = selected.map(v => v[valueKey])
      this.selected_label = selected.map(v => v[labelKey])
    }
  }
}
</script>
