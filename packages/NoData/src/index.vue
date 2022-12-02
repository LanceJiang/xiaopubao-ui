<template>
  <div v-on='$listeners' :class="['xpb-no-data-wrap', size, isFull ? 'xpb-no-data-wrap--full' : '']">
    <Icon iconClass="xpb-no-data" class="xpb-no-data-wrap__img"/>
    <div class="message" v-html="message || t('xpb.noData')"/>
    <!-- 额外处理 -->
    <slot name="extraContent"/>
  </div>
</template>

<script>
import Icon from 'xiaopubao-ui/packages/Icon'
import Locale from 'xiaopubao-ui/src/mixins/locale'
export default {
  name: 'XNoData',
  mixins: [Locale],
  props: {
    message: {
      type: String,
      default: ''
    },
    isFull: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small' // large medium small mini
    }
  },
  components: {
    Icon
  },
  created() {
  }
}
</script>
