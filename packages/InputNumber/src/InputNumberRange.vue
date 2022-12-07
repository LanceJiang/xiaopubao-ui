<!-- 仅支持数据对象 -->
<template>
  <a-input-group
    compact
    class="xpb-input-number-range"
    :class="[
      has_addonBefore ? 'has_addonBefore' : '',
      has_addonAfter ? 'has_addonAfter' : ''
    ]">
    <span v-show="has_addonBefore" class="ant-input-group-addon">
      <slot name="addonBefore">{{ addonBefore }}</slot>
    </span>
    <InputNumber
      class="rate100 xpb-input-number-range_start"
      v-bind="$attrs"
      :value="params[local_propStart]"
      @change="onChangeStart"
      @pressEnter="$emit('pressEnter', $event, local_propStart)"
      :placeholder="placeholderStart"
      :precision="precision"
      :style="localStyle"
    />
    <a-input
      class="line"
      placeholder="~"
      disabled
    />
    <InputNumber
      class="rate100 xpb-input-number-range_end"
      v-bind="$attrs"
      :value="params[local_propEnd]"
      @change="onChangeEnd"
      @pressEnter="$emit('pressEnter', $event, local_propEnd)"
      :placeholder="placeholderEnd"
      :precision="precision"
      :style="localStyle"
    />
    <span v-show="has_addonAfter" class="ant-input-group-addon">
      <slot name="addonAfter">{{ addonAfter }}</slot>
    </span>
  </a-input-group>
</template>
<script>
import InputNumber from './index'
export default {
  name: 'XInputNumberRange',
  components: {
    InputNumber
  },
  model: {
    prop: 'params',
    event: 'update:inputRange'
  },
  props: {
    params: {
      type: Object,
      required: true
    },
    // 数值精度
    precision: {
      type: Number,
      default: 0
    },
    // 前缀
    propStart: {
      type: String
    },
    // 后缀
    propEnd: {
      type: String
    },
    // 默认prop
    prop: {
      type: String,
      default: ''
      // 若不定义 propStart  propEnd 则为 最小值(`${prop}Start`)   最大值(`${prop}End`)
    },
    placeholderStart: {
      type: String,
      default: '最小值'
    },
    placeholderEnd: {
      type: String,
      default: '最大值'
    },
    // 自定义样式(最大值/最小值)
    itemStyle: {
      type: String,
      default: ''
    },
    // 自定义 宽(最大值/最小值)
    itemWidth: {
      type: String,
      default: '100px'
    },
    // 前缀
    addonBefore: {
      type: [String, Number],
      default: ''
    },
    // 后缀
    addonAfter: {
      type: [String, Number],
      default: ''
    },
    // 前缀展示
    addonBeforeVisible: {
      type: Boolean,
      default: true
    },
    // 后缀展示
    addonAfterVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  computed: {
    local_propStart () {
      return this.propStart || `${this.prop}Start`
    },
    local_propEnd () {
      return this.propEnd || `${this.prop}End`
    },
    localStyle () {
      return `${this.itemStyle} width: ${this.itemWidth};`
    },
    has_addonBefore () {
      // if (this.addonBefore || this.$scopedSlots.addonBefore) return true
      if ((this.addonBefore || this.$scopedSlots.addonBefore) && this.addonBeforeVisible !== false) return true
      return false
    },
    has_addonAfter () {
      // if (this.addonAfter || this.$scopedSlots.addonAfter) return true
      if ((this.addonAfter || this.$scopedSlots.addonAfter) && this.addonAfterVisible !== false) return true
      return false
    }
  },
  methods: {
    getValidValue (value, isStart) {
      const { params, local_propStart, local_propEnd } = this
      if (isStart) {
        // 校验 start （start > end 改为 end）
        const endV = params[local_propEnd]
        if (isNaN(endV) || endV === null) return value
        if (value > endV) return endV
        return value
      } else {
        // 校验 end （end < start 改为 start）
        const startV = params[local_propStart]
        if (isNaN(startV) || value === null) return value
        if (value < startV) return startV
        return value
      }
    },
    onChangeStart (value) {
      const { params, local_propStart } = this
      value = this.getValidValue(value, true)
      this.$set(params, local_propStart, value)
      this.$emit('change', value, local_propStart)
    },
    onChangeEnd (value) {
      const { params, local_propEnd } = this
      value = this.getValidValue(value, false)
      this.$set(params, local_propEnd, value)
      this.$emit('change', value, local_propEnd)
    }
  }
}

</script>
