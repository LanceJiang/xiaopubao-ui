<script type='text/jsx'>
import { t } from 'xiaopubao-ui/src/locale'

export default {
  name: 'XInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {},
    params: {
      type: Object
    }
  },
  render() {
    const { addonBefore, addonAfter, placeholder, prop, ...props } = this.$attrs
    const onEvents = this.$listeners
    const _addonBefore = addonBefore ? <span class='ant-input-group-addon'>{addonBefore}</span> : ''
    const _addonAfter = addonAfter ? <span class='ant-input-group-addon'>{addonAfter}</span> : ''
    return <div class='xpb-input-number ant-input-group'>
      {_addonBefore}
      <a-input-number
        props={props}
        placeholder={placeholder || t('xpb.ant.input.placeholder')}
        value={this.localValue} on={onEvents}
      />
      {_addonAfter}
    </div>
  },
  data() {
    return {}
  },
  computed: {
    localValue() {
      const { prop } = this.$attrs
      const { value, params } = this
      if (prop && params) {
        return params[prop]
      }
      return value
    }
  }
}
</script>
