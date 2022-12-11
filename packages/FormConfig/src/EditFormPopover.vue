<template>
  <a-popover
    :overlayClassName="overlayClassName"
    :trigger="['click']"
    :visible="comp_visible"
    @visibleChange="visibleChange"
    :getPopupContainer="getPopupContainer"
    placement="bottom">
<!-- 触发的内容区 -->
    <slot name="trigger">
      <a-icon type="edit" class="row-hover-visible"/>
    </slot>
    <template slot="content">
      <div class="xpb-edit-form_content-wrap" :style='widthStyle'>
        <slot/>
        <div v-if='showFooter' class='footer'>
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
// 公用编辑 数据 popover 弹窗
export default {
  name: 'XEditFormPopover',
  components: {
  },
  provide () {
    return {
      $formParent: this
    }
  },
  // model: {
  //   prop: 'visible',
  //   event: 'update:visible'
  // },
  props: {
    visible: {
      type: [Boolean, null],
      default: null
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: ''
    },
    overlayClassName: {
      type: String,
      default: ''
    }
    /* submit: {
      type: Function,
      default: (cancelFn) => console.warn('请添加 submit 进行确定')
    },
    cancel: {
      type: Function
    }, */
  },
  data () {
    return {
      localVisible: false
    }
  },
  computed: {
    comp_visible () {
      if (typeof this.visible !== 'boolean') return this.localVisible
      return this.visible
    },
    widthStyle() {
      const width = this.width
      return width ? `width: ${width}` : ''
    }
  },
  watch: {
    comp_visible: {
      handler(bool) {
        if (bool) {
          // 提示更新当前row数据
          this.$emit('getCurRow')
        }
        this.$emit('getVisible', bool)
      },
      immediate: true
    }
  },
  methods: {
    getPopupContainer (triggerNode) {
      return triggerNode.parentNode
    },
    visibleChange(visible) {
      // console.log('visibleChange', visible)
      this.$emit('update:visible', visible)
      this.localVisible = visible
    },
    visibleChangeHide() {
      this.visibleChange(false)
    },
    // 默认执行 提交
    onSubmit() {
      // this.submit()
      this.$emit('submit')
      // this.submit(this.visibleChangeHide) // tobe
      this.visibleChangeHide()
    },
    // 默认执行 取消
    onCancel() {
      // if (this.cancel) this.cancel()
      this.$emit('cancel')
      // if (this.cancel) return this.cancel(this.visibleChangeHide) // tobe
      this.visibleChangeHide()
    },
    // provide 子组件使用
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
