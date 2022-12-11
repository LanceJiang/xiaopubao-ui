<script>
import FormConfig from 'xiaopubao-ui/packages/FormConfig'
const render = function(h) {
  const { title, visible, width, changeVisible, formOptions, formData } = this
  const on = {
    'update:visible': changeVisible,
    cancel: changeVisible
  }
  return <a-modal
    visible={visible}
    props={this.$attrs}
    maskClosable={false}
    footer={null}
    width={width}
    class="xpb-modal xpb-form-config-modal"
    on={on}
  >
    {/* 自定义Modal 标题 */}
    <template slot='title'>
      {this.$slots.title || title}
    </template>
    {
      visible && <FormConfig
        ref="$$form"
        props={formOptions}
        form-data={formData}
        onSubmit={this.onSubmit}
        onCancel={changeVisible}
        scopedSlots={this.$scopedSlots}
      />
    }
    {/* 额外 其他功能  注意： (若弹窗含有额外功能 将会对 FormModelConfig 的底部操作进行屏蔽 请自行实现相关操作按钮) */}
    {this.$slots.extra}
    {/* eg: <div class="extra-wrap">额外 其他功能 外壳样式</div> */}
  </a-modal>
}

export default {
  name: 'XFormConfigModal',
  components: {
    FormConfig
  },
  emits: ['submit', 'update:visible'],
  props: {
    title: {
      type: String,
      default: '请输入 title 标题'
    },
    formOptions: {
      required: true,
      type: Object,
      default: () => ({
        // form配置数组
        forms: [],
        // form的配置项对象
        formConfig: {}
        /** formConfig: {
          size,
          labelWidth,
          itemWidth,
          span,
          submitLoading,
          submitBtnText,
          showResetBtn,
          resetBtnText,
          showCancelBtn,
        } */
      })
    },
    // 初始化数据对象
    formData: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      required: true
    },
    width: {
      type: String
    }
  },
  render,
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    changeVisible(bool = false) {
      this.$emit('update:visible', bool)
    },
    onSubmit(events) {
      this.$emit('submit', events)
    }
  }
}
</script>
