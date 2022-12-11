<script lang="jsx">
export default {
  name: 'XTextArea',
  render() {
    const { form, params, disabled } = this
    const { itemWidth, numLimit } = form
    const autoSize = form.autoSize === undefined ? { minRows: 3, maxRows: 5 } : form.autoSize
    const _itemWidth = typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth
    const isLimitShow = typeof numLimit === 'number' && numLimit > 0
    const cur = params[form.prop] && params[form.prop].trim()
    return <div class="xpb-text-area">
      <a-textarea
        v-model={params[form.prop]}
        autoSize={autoSize}
        disabled={disabled}
        placeholder={form.placeholder || `请输入${form.label || ''}`}
        maxLength={numLimit || form.maxLength || 5000}
        style={`${form.itemStyle} width:${_itemWidth || '100%'};`}
        onInput={this.textAreaInput}
        onChange={this.triggerChange}
      />
      {isLimitShow ? <span class="show-num">{ cur ? cur.length : 0 } / { numLimit }</span> : ''}
    </div>
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    disabled() {
      let disabled = this.form.disabled
      if (disabled === undefined) {
        disabled = this.isEdit === false
      }
      return disabled
    },
    itemStyle() {
      const { itemWidth } = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    }
  },
  methods: {
    textAreaInput(input) {
      const {
        form,
        params
      } = this
      if (form.input && typeof form.input === 'function') {
        // console.log('prop input function 执行...');
        form.input(input, params)
      }
      this.$emit('input', input)
    },
    triggerChange(input) {
      this.$emit('change', input)
    }
  }
}
</script>
