<template>
  <div class="flex-column-page-wrap pageWrap">
    Forms
    <div class="common_title">x-form-config</div>
    <div class="content">
      <XFormConfig
        ref="local_form"
        class="local_formConfig"
        :forms="forms"
        :formConfig="formConfig"
        @submit="formSubmit"
      >
        <template #xSelectSlot="{option, label}">
          <div style="background: #A0AAB7;">
            {{label}} +
            <div style='color: yellow;'>{{ option.value }}</div>
          </div>
        </template>
      </XFormConfig>
    </div>

    <div class="common_title">x-form-config 表单 嵌入 modal</div>
    <div class="content">
      <a-button @click="modalVisible = true">打开 弹窗</a-button>
      <a-modal
        :title="'表单 嵌入 modal'"
        :visible="modalVisible"
        @update:visible="changeVisible"
        :maskClosable="false"
        :footer="null"
        class="local_modal x-modal-wrap"
        customClass="x-modal x-form-config-modal"
        @close="changeVisible(false)"
      >
        <XFormConfig
          v-if="modalVisible"
          ref="configForm"
          :forms="forms"
          :formConfig="formConfig"
          :form-data="formData"
          @submit="formSubmit"
          @cancel="changeVisible"
        >
          <template #xSelectSlot="{option, label}">
            <div style="background: #f0f;">{{label}} + {{ option.value_1 }}</div>
          </template>
        </XFormConfig>
      </a-modal>
    </div>
    <div class="common_title">x-form-config-modal 表单弹窗</div>
    <div class="content">
      <a-button @click="modalVisible2 = true">打开 弹窗</a-button>
      <XFormConfigModal
        v-if="modalVisible2"
        title="x-form-config-modal 表单弹窗"
        :visible.sync="modalVisible2"
        :formOptions="{
          forms,
          formConfig
        }"
        :formData="formData"
        @submit="formSubmit"
      >
        <template #xSelectSlot="{option, label}">
          <div style="background: green;">{{label}} + {{ option.value_1 }}</div>
        </template>
      </XFormConfigModal>
    </div>
    <div class="common_title">x-edit-form-popover 表单编辑外壳</div>
    <div class="content">
<!--      @getCurRow='getCurRow(row)'-->
      <XEditFormPopover
        width='300px'
        :showFooter='false'
      >
        <!-- 测试 通过 XFormConfig 与 XEditFormPopover 配套使用 示例 -->
        <XFormConfig
          :forms="forms"
          :form-data="columnsData"
          :formConfig="formConfig"
          showCancelBtn
          @cancel='cancel_formConfig'
          @submit='submit_formConfig'
        />
      </XEditFormPopover>
      <br>
<!--      @getCurRow='getCurRow(row)'-->
      <XEditFormPopover
        @cancel="cancel_formConfig"
        @submit='submit_formConfig'
      >
        <!--     自定义_ 测试编辑销售额     -->
        <XInputNumber
          class='rate100'
          v-model="columnsData.sum_sale_amount"
          :precision="2"
          :min="1"
          :max="1000000"
          placeholder="请输入金额"
          :addonAfter="columnsData.current_currency"/>
      </XEditFormPopover>
    </div>
  </div>
</template>

<script>
import i18n from '@/locales'

const prefix = 'outboundOrder.modal.'

export default {
  name: 'forms',
  data() {
    // const _this = this
    return {
      columnsData: {},
      formData: {
        test1_select: 'test1_2'
      },
      forms: [
        // xSelect
        {
          prop: 'xSelect', // 提交的 params 的字段
          label: 'xSelect', // label 标签
          itemType: 'xSelect', // form-item 类型
          labelKey: 'label_1',
          // valueKey: 'value_1',
          // isPopover: false,
          options: Array.from({ length: 20 }).map((_, i) => {
            return {
              value: 'value_1选项' + i,
              label_1: '黄金糕' + i
            }
          }),
          slotOption: 'xSelectSlot'
          // change: _this.serviceChange
        },
        {
          prop: 'xSelectMultiple', // 提交的 params 的字段
          label: 'xSelectMultiple', // label 标签
          itemType: 'xSelect', // form-item 类型
          multiple: true,
          labelKey: 'label_1',
          valueKey: 'value_1',
          options: Array.from({ length: 20 }).map((_, i) => {
            return {
              value_1: '选项' + i,
              label_1: 'xSelect多选' + i
            }
          })
        },
        // render { render:function 必传 }
        {
          prop: 'render',
          // label: '自定义Render',
          t_label: `${prefix}test2`,
          itemType: 'render',
          // span: 12,
          change(...args) {
            console.error(...args, 'change...')
          },
          rules: [
            {
              required: true,
              message: i18n.t('xpb.validate.validateEmptyTips', {
                name: i18n.t(`${prefix}test2`)
              }),
              trigger: 'blur'
            }
          ],
          render: (h, extendsParams) => {
            const { form, params } = extendsParams
            console.error(form, params, '///////////')
            return <a-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
          }
        },
        // select
        {
          prop: 'test1_select',
          t_label: `${prefix}test1`,
          itemType: 'select',
          disabled: false,
          // valueKey: 'value', // 默认
          // labelKey: 'label', // 默认
          // clearable: true,
          filterable: true,
          // placeholder: '请选择项目阶段',
          options: Array.from({ length: 6 }).map((_, i) => ({
            label: `test1_LABEL_${i}`,
            value: `test1_${i}`
          })),
          slotOption: 'xSelectSlot',
          rules: [
            {
              required: true,
              message: i18n.t('xpb.validate.validateEmptyTips', {
                name: i18n.t(`${prefix}test1`)
              }),
              trigger: ['change', 'blur']
            }
          ]
          // change: _this.serviceChange
        },
        /* {
          prop: 'account_alias',
          t_label: `${prefix}test2`,
          valueKey: 'account_alias',
          labelKey: 'nick_name',
          itemType: 'select',
          disabled: false,
          filterable: true,
          // placeholder: '请选择参与人员',
          options: Array.from({ length: 6 }).map((_, i) => ({
            nick_name: `service_LABEL_${i}`,
            account_alias: `account_alias_${i}`
          })),
          rules: [
            {
              required: true,
              message: i18n.t('xpb.validate.validateEmptyTips', {
                name: i18n.t(`${prefix}test2`)
              }),
              trigger: ['change', 'blur']
            }
          ]
          // change: _this.accountChange
        }, */
        // radio
        {
          prop: 'radio',
          // label: '自定义Render',
          t_label: `${prefix}test3`,
          itemType: 'radio',
          // span: 12,
          labelKey: 'labelX',
          valueKey: 'valueX',
          options: [
            // 'radio1',
            // 'radio2'
            { valueX: 'Y', labelX: 'radio1' },
            { valueX: 'N', labelX: 'radio2' }
          ],
          rules: [
            {
              required: true,
              message: i18n.t('xpb.validate.validateEmptyTips', {
                name: i18n.t(`${prefix}test3`)
              }),
              trigger: 'blur'
            }
          ]
        },
        // cascader
        {
          prop: 'cascader',
          // label: 'cascader',
          t_label: `${prefix}test4`,
          itemType: 'cascader',
          // placeholder: '请选择cascader____',
          options: [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake'
                    }
                  ]
                }
              ]
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men'
                    }
                  ]
                }
              ]
            }
          ],
          rules: [
            {
              required: true,
              message: i18n.t('xpb.validate.validateEmptyTips', {
                name: i18n.t(`${prefix}test4`)
              }),
              trigger: 'blur'
            }
          ]
        },
        // inputNumber
        {
          prop: 'inputNumber',
          // label: 'inputNumber',
          t_label: `${prefix}test5`,
          prefix: 'Http://',
          suffix: '.com',
          itemType: 'inputNumber',
          change(...args) {
            console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
          }
        },
        // date
        {
          prop: 'date',
          // label: 'date(对应-date-picker)',
          t_label: `${prefix}test6`,
          itemType: 'date',
          placeholder: '请输入date'
        },
        // dateRange
        {
          prop: 'dateRange',
          startKey: 'dateRangeStart',
          endKey: 'dateRangeEnd',
          t_label: `${prefix}test7`,
          itemType: 'dateRange'
        },
        {
          prop: 'switch',
          label: 'switch',
          itemType: 'switch'
          // checkedChildren: '开',
          // unCheckedChildren: '关'
        },
        {
          prop: 'input',
          label: 'input',
          itemType: 'input'
        }
      ],
      formConfig: {
        labelPosition: 'left', // right // top
        // labelPosition: 'top',
        labelWidth: '120px',
        itemWidth: '100%',
        // labelSuffix: '',
        submitLoading: false,
        showCancelBtn: true,
        showResetBtn: true
        // showFooter: false
      },
      modalVisible: false,
      modalVisible2: false
    }
  },
  methods: {
    cancel_formConfig(cancelFn) {
      // 嵌套了 formConfig 才有cancelFn
      console.log(cancelFn, 'cancelFn')
      cancelFn && cancelFn() // 关闭弹窗
    },
    submit_formConfig(params, submitFn) {
      // 嵌套了 formConfig 才有 submitFn
      // params: form组件最终的 值对象
      // submitFn: EditPopover 组件 provide 的 内置方法
      console.log(params, submitFn, 'params, submitFn')
      // this.options.loading = true
      const res = { ...this.columnsData, params }
      console.log(res, '提交的值 todo...')
      this.$message.success('假设 操作成功.... todo')
      submitFn && submitFn() // 关闭弹窗
    },
    serviceChange(value, options, params) {
      console.error(value, options, params, 'value, options, params')
      // 重置账号
      params.account_alias = undefined
      // 更新账号 options
      // this.forms.find((v) => v.prop === 'account_alias').options = this.local_services.get(value)
    },
    formSubmit(params) {
      console.error('params', params)
      this.formConfig.submitLoading = true
      setTimeout(() => {
        this.formConfig.submitLoading = false
        this.modalVisible = false
        this.modalVisible2 = false
        this.$message.error('提交 成功 ')
      }, 1000)
    },
    changeVisible(bool = false) {
      this.modalVisible = bool
    }
  }
}
</script>
<style lang="less" scoped>
.pageWrap {
  padding: 10px 12px;
  overflow: auto;
}

.local_formConfig {
  background: #fafafa;
  padding: 24px;
  //padding-top: 10px;
  border-radius: 6px 6px 0 0;

  &::v-deep {
    .form_wrap {
      overflow-y: unset;
    }
  }
}
</style>
