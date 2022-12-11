<script lang="jsx">
import { t } from 'xiaopubao-ui/src/locale'
import InputNumber from 'xiaopubao-ui/packages/InputNumber'
import TextArea from 'xiaopubao-ui/packages/TextArea'
import CustomRender from 'xiaopubao-ui/packages/CustomRender'
import XSelect from 'xiaopubao-ui/packages/Select'
import { renderSelectOption } from 'xiaopubao-ui/src/utils/slotsUtils'
import { getDeepValue } from 'xiaopubao-ui/src/utils'

// 后面整 新的 搜索 组件时 再进行处理 todo...
const defaultFilterOption = (input, option) => {
  return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
export default {
  name: 'XFormConfig',
  inject: {
    $formParent: {
      default: null
    }
  },
  components: {
    InputNumber,
    TextArea,
    CustomRender,
    XSelect
  },
  render () {
    const { isEdit, forms, params, local_formConfig, itemStyle } = this
    const {
      showLabel,
      gutter,
      span,
      showFooter,
      submitBtnText,
      cancelBtnText,
      resetBtnText,
      submitLoading,
      showCancelBtn,
      showResetBtn,
      ...form_config
    } = local_formConfig
    const itemRender = (form) => {
      // const propKey = form.prop
      const { prop, itemType, itemWidth, options, change, itemStyle: form_itemStyle = '', itemClass, placeholder, t_placeholder, ...formOthers } = form
      const _options = options || []
      const _itemStyle = itemStyle + form_itemStyle + (itemWidth ? `width: ${itemWidth};` : '')
      let _placeholder = t_placeholder ? t(t_placeholder) : placeholder

      let disabled = form.disabled
      if (disabled === undefined) {
        disabled = isEdit === false
      }
      const render_selectOptions = () => {
        return _options.map((option) => {
          let value = option
          let label = option
          let disabled = false
          if (typeof option === 'object') {
            value = option[form.valueKey || 'value']
            label = option[form.labelKey || 'label']
            if (form.i18n) label = t(label)
            disabled = option.disabled
          }
          return <a-select-option
            key={value}
            value={value}
            label={label}
            disabled={disabled}
            title={label}>
            { renderSelectOption.call(this, form.slotOption, option, label) }
          </a-select-option>
        })
      }
      switch (itemType) {
        /* 自定义 xiaopubao 自定义Select */
        case 'xSelect' :
          // todo
          return <XSelect
            class={itemClass}
            v-model={params[prop]}
            onChange={() => change && change(params[prop], _options, params)}
            props={formOthers}
            options={_options}
            placeholder={_placeholder}
            width={itemWidth || local_formConfig.itemWidth}
          />
        /* 自定义 render */
        case 'render' :
          return <CustomRender
            form={form}
            params={params}
          />
        /* 下拉框 */
        case 'select':
          var filterOption = formOthers.filterOption || defaultFilterOption
          return <a-select
            class={itemClass}
            optionLabelProp='label'
            props={formOthers}
            v-model={params[prop]}
            onChange={() => change && change(params[prop], _options, params)}
            filterOption={filterOption}
            style={_itemStyle}
            disabled={disabled}
            placeholder={_placeholder}>
            {render_selectOptions()}
          </a-select>
        /* 单选框 */
        case 'radio':
          return <a-radio-group
            class={itemClass}
            props={formOthers}
            v-model={params[prop]}
            disabled={disabled}
            onChange={() => change && change(params[prop], _options, params)}
            style={_itemStyle}
          >
            {
              _options.map((option, optionIndex) => {
                let value = option
                let label = option
                let disabled = false
                if (typeof option === 'object') {
                  value = option[form.valueKey || 'value']
                  label = option[form.labelKey || 'label']
                  if (form.i18n) label = t(label)
                  disabled = option.disabled
                }
                return <a-radio
                  key={optionIndex + '_local'}
                  value={value}
                  disabled={disabled}
                  title={label}>
                  {label}
                </a-radio>
              })
            }
          </a-radio-group>
        /* 级联 */
        case 'cascader':
          return <a-cascader
            class={itemClass}
            props={formOthers}
            v-model={params[prop]}
            onChange={() => change && change(params[prop], _options, params)}
            style={_itemStyle}
            disabled={disabled}
            allowClear={form.allowClear ?? true}
            options={_options}
            placeholder={_placeholder}
          />
        /* 数字 */
        case 'inputNumber':
          return <InputNumber
            class={`rate100 ${itemClass}`}
            v-model={params[prop]}
            attrs={formOthers}
            onChange={() => change && change(params[prop], _options, params)}
            style={_itemStyle}
            disabled={disabled}
            placeholder={_placeholder}
            precision={form.precision || 0}
          />
        /* 日期选择 */
        case 'date':
          return <a-date-picker
            class={itemClass}
            v-model={params[prop]}
            props={formOthers}
            onChange={() => change && change(params[prop], _options, params)}
            style={_itemStyle}
            disabled={disabled}
            placeholder={_placeholder}
            value-format={form.valueFormat || 'YYYY-MM-DD'}/>
        /* 日期区间 */
        case 'dateRange':
          if (Array.isArray(t_placeholder)) _placeholder = t_placeholder.map(holder => t(holder))
          return <a-range-picker
            class={itemClass}
            v-model={params[prop]}
            props={formOthers}
            onChange={() => change && change(params[prop], _options, params)}
            style={_itemStyle}
            disabled={disabled}
            placeholder={_placeholder}
            value-format={form.valueFormat || 'YYYY-MM-DD'}><a-icon slot="suffixIcon" type="calendar" /></a-range-picker>
        case 'switch':
          return <a-switch
            class={itemClass}
            props={formOthers}
            v-model={params[prop]}
            onChange={() => change && change(params[prop], _options, params)}
            disabled={disabled}
          />
        case 'textarea':
          return <TextArea
            isEdit={isEdit}
            form={form}
            params={params}
          />
        case 'input':
        default:
          return <a-input
            class={itemClass}
            props={formOthers}
            v-model={params[prop]}
            onChange={() => change && change(params[prop], _options, params)}
            disabled={disabled}
            placeholder={_placeholder}
            style={_itemStyle}/>
      }
    }
    const createFooter = () => {
      const { resetForm, cancelHandler, submitHandler } = this
      return <div class="footer">
        { showResetBtn ? <a-button
          type="dashed"
          onClick={resetForm}>
          { t(resetBtnText) }
        </a-button> : '' }
        { showCancelBtn ? <a-button
          onClick={cancelHandler}>
          {t(cancelBtnText)}
        </a-button> : '' }
        <a-button
          type="primary"
          loading={submitLoading}
          onClick={submitHandler}>
          {t(submitBtnText)}
        </a-button>
      </div>
    }
    return <a-form-model
      ref="baseForm"
      class="xpb-form-config"
      props={{ model: params, ...form_config }}>
      <a-row class={`form_wrap ${showLabel === false && 'hideLabel'}`} gutter={gutter}>
        {forms.map((form, idx) => {
          const { t_label, label, ...others } = form
          const _label = t_label ? t(t_label) : label
          return <a-col key={idx} span={form.span ?? span}>
            <a-form-model-item
              key={idx}
              props={others}
              label={_label}
            >
              {itemRender(form)}
            </a-form-model-item>
          </a-col>
        })}
        {/** 额外的插入内容 */}
        {this.$slots.extraContent}
      </a-row>
      {
        showFooter && createFooter()
      }
      {this.$slots.default}
    </a-form-model>
  },
  props: {
    forms: {
      type: Array,
      required: true
      // [{
      //   t_label: String,
      //   label: String,
      //   prop: [String, Array],
      //   itemType: String,
      //   options: Array,
      //   valueKey: String,
      //   labelKey: String,
      //   formValueFormat: Function, // 提交前的数据修改
      //   rules: Array
      //   render?: function(h, { form, params }) { JSX || createElement } // itemType === 'render' 专用
      //   i18n: Boolean 多语言转换
      // }]
    },
    // 后台传递的初始值 对象 【后期拿操作的表单数据  请使用 submit 的params】
    formData: {
      type: Object,
      default: () => ({})
    },
    // form的配置项对象 参考 local_formConfig
    formConfig: {
      type: Object,
      default: () => ({})
    },
    // 是否可以编辑
    isEdit: {
      type: Boolean,
      default: true
    },

    cancel: {
      type: Function,
      default: function () {
        console.warn('请输入 cancel 函数')
      }
    }
    /* showFooter: {
      type: Boolean,
      default: true
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    submitBtnText: {
      type: String,
      default: '确定'
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    showResetBtn: {
      type: Boolean,
      default: false
    },
    resetBtnText: {
      type: String,
      default: '重置'
    } */
  },
  data () {
    const { forms, formData } = this.$props
    // const _this = this
    const formValueFormats = {}
    const params = this.changeFormData(formData, true)
    // 遍历 集成formValueFormats对象
    forms.forEach((v, i) => {
      const { prop, formValueFormat } = v
      if (formValueFormat) {
        // formValueFormat 为 提交的 美化函数(自触发)  formValueFormat(params, prop)
        formValueFormats[prop] = formValueFormat
      }
    })
    return {
      params,
      formValueFormats
    }
  },
  computed: {
    itemStyle () {
      const { itemWidth } = this.formConfig
      if (itemWidth) {
        return `width: ${itemWidth};`
      }
      return ''
    },
    local_formConfig () {
      const defaultConfig = {
        /** 自定义Config */
        // 默认的formItem内容宽度(eg: input/select/radio...)
        itemWidth: undefined,
        // 默认的formItem 外壳 col之间的 间隔
        gutter: 0,
        // 默认的formItem 对应的 col 外壳 span 配置
        span: 24,
        // 默认的formItem 对应的 label 是否展示
        showLabel: true,
        // 是否展示 底部操作集合
        showFooter: true,
        // footer下的 提交按钮 描述
        submitBtnText: 'xpb.btn.confirm',
        // footer下的 提交按钮loading
        submitLoading: false,
        // footer下的 取消按钮 是否显示
        showCancelBtn: true,
        // footer下的 取消按钮 text
        cancelBtnText: 'xpb.btn.cancel',
        // footer下的 重置按钮 是否显示
        showResetBtn: false,
        // footer下的 重置按钮 text
        resetBtnText: 'xpb.btn.reset',

        /**
         * ant a-form-model 中的配置
         */
        labelAlign: 'right', // left / right
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
      return Object.assign(defaultConfig, this.formConfig)
    }
  },
  watch: {
    formData: {
      handler (newData, oldData) {
        // console.warn(newData, oldData, 'newFormData, oldFormData  formData 发生改变 ... 监听  formData... 触发此处...')
        this.changeFormData(newData)
      }
      // deep: true
    }
    // forms: {
    //   handler (newData, oldData) {
    //     console.warn(newData, oldData, 'forms update 触发此处...')
    //   },
    //   deep: true
    // }
  },
  methods: {
    changeFormData (formData, isInit) {
      const {
        forms
      } = this
      const params = {}
      const bindProps = []
      forms.forEach((v, i) => {
        const _prop = v.prop
        const propType = typeof _prop
        const props = v.props // 绑定的其他数据
        if (propType === 'string') {
          params[_prop] = this.setItemData(formData[_prop]) // 数据初始化
          if (v.itemType === 'dateRange') { // todo... temptemptemp
            const startKey = v.startKey || _prop + 'Start'
            const endKey = v.endKey || _prop + 'End'
            const hasDate = formData[startKey] && formData[endKey]
            params[_prop] = hasDate
              // 仅当 初始日期 和 结束日期 都有的情况下 才赋值 prop值
              ? [formData[startKey], formData[endKey]]
              // 若不存在 对应的 dateStart dateEnd  判断是否含有 date[] 进行赋值
              : (Array.isArray(formData[_prop]) ? formData[_prop] : [])
          } else if (v.itemType === 'cascader') { // 级联数据为数组
            params[_prop] = params[_prop] || [] // 变成数组  // 若不是数组 怎么操作
          } /* else if (v.itemType === 'upload') {
            params[_prop] = params[_prop] || [] // 变成数组
          } */
        }
        // 若该formItem  包含forms列表中未定义的prop 需要从formData取值
        if (Array.isArray(props)) {
          bindProps.push(...props)
        }
      })
      // 赋值其他被绑的的值
      bindProps.map(prop => {
        params[prop] = formData[prop] // 被绑定的其他数据初始化
      })
      if (isInit) {
        return params
      } else {
        this.params = params
      }
    },
    cancelHandler() {
      // parentCancel 仅对 有 注入 $formParent 的外壳组件生效
      const parentCancel = getDeepValue(this.$formParent, ['cancelHandler'])
      this.$emit('cancel', parentCancel)
      // this.cancel && this.cancel(parentCancel)
    },
    submitHandler (submitCallback) {
      this.getParams((error, params) => {
        if (!error) {
          // 若在父级组件使用 自定义的操作按钮， 可调用callback函数 作为提交操作
          if (typeof submitCallback === 'function') {
            return submitCallback(params)
          }
          const parentSubmit = getDeepValue(this.$formParent, ['submitHandler'])
          // parentSubmit 仅对 有 注入 $formParent 的外壳组件生效
          this.$emit('submit', params, parentSubmit)
        } else {
          console.warn(error, '错误rule数组.... 如果需要对该错误数组 操作 请在此处添加')
          // eg:
          // 提示弹窗的 示例代码
          /* const keys = Object.keys(error)
          console.log(error[keys[0]], 'errObj[keys[0]]')
          const errTipObj = (error[keys[0]][0] || {})
          if (errTipObj.message) {
            this.$message.error(errTipObj.message)
          } */
        }
      })
    },
    getParams (callback, unValidate = false) {
      const _getParams = () => {
        const { params, formValueFormats, forms } = this
        const formDataFormat = {} // 最后提交后台使用的params对象
        forms.forEach(form => {
          const key = form.prop
          if (key) {
            // 对应的form 内部设置有 formValueFormats 函数的值做提交前的最后操作 fn(value, key)
            if (form.itemType === 'dateRange' && form.isSplit) { // isSplit: 若 时间区间 是拆分 传递给后台的话...
              const startKey = form.startKey || key + 'Start'
              const endKey = form.endKey || key + 'End'
              const [startDate, endDate] = params[key]
              formDataFormat[startKey] = startDate
              formDataFormat[endKey] = endDate
            } else {
              formDataFormat[key] = formValueFormats[key] ? formValueFormats[key](params, key) : params[key]
            }
          }
          // 对含有 其他prop的数据 赋值
          if (Array.isArray(form.props)) {
            form.props.map(_key => {
              formDataFormat[_key] = params[_key]
            })
          }
        })
        if (callback) callback(null, formDataFormat)
      }
      if (unValidate) {
        _getParams()
        return
      }
      this.$refs.baseForm.validate((valid, errObj) => {
        if (valid) {
          _getParams()
        } else {
          // console.error(errObj, 'errObj..................')
          if (callback) callback(errObj)
        }
      })
    },
    resetForm (isAsync) {
      // 是否异步 传入的 formData 重置
      // if (isAsync) {
      // 由于 formData 从父级传入后 内部并没有直接使用 固可用做 重置功能
      this.changeFormData(this.formData)
      // } else {
      //   this.$refs.baseForm.resetFields()
      // }
    },
    setItemData (value, defaultValue) {
      if (typeof value !== 'boolean' && typeof value !== 'number') {
        return value || defaultValue
      }
      return value
    }
  }
}

/**
 * eg:  示例  实例参考 examples/views/forms.vue
 */
/* <XFormConfig
        ref="configForm"
        :forms="formOptions.forms" // 遍历formItem 的数组
        :formData="formOptions.formData" // 初始化 form数据
        :formConfig="formOptions.formConfig" // 相关FormConfig 的配置对象
        @submit="submit" // 取消按钮点击操作
        @cancel="close" // 取消按钮点击操作
        :isEdit="formOptions.isEdit" // 是否以 纯展示方式 展示数据 //(不可编辑) // 需要传递的 参数也最少
        />

        var formOptions = {
            formConfig: {
              // resetBtnText: 'resetBtnText',
              showResetBtn: true,
              showCancelBtn: true,
              // itemWidth: '200px', // 默认 表单元素的宽度
            },
            forms: [
            {
                prop: 'input',
                label: 'input',
                itemType: 'input'
            },
            { // 选人
                prop: 'select',
                label: 'select',
                itemType: 'select',
                options: [
                    {value: 0, label: '小三'},
                    {value: 1, label: '小四'}
                ]
            }
        ]
    } */
</script>
