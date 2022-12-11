<template>
  <div>我是非必须的 额外组件 示例</div>
</template>

<script>

const props = {
  // id: {
  //   type: String,
  //   default: `pdf_${Math.random().toString().slice(-10)}_${+new Date()}`,
  // },
  /**
   * pdf缩放比例
   */
  scale: {
    type: Number,
    default: 1
  },
  /**
   * pdf文件路径
   */
  url: {
    type: String,
    default: ''
  }
}

export default {
  name: 'XPdfPreview',
  props,
  data() {
    return {
      loading: false
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
