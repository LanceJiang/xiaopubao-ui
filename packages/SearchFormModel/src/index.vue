<script lang="jsx">
import InputNumber from 'xiaopubao-ui/packages/InputNumber'
import InputNumberRange from 'xiaopubao-ui/packages/InputNumberRange'
import CustomRender from 'xiaopubao-ui/packages/CustomRender'
import XSelect from 'xiaopubao-ui/packages/Select'
import { getDeepValue } from 'xiaopubao-ui/src/utils/index'
export default {
  name: 'XSearchFormModel',
  componentName: 'XSearchFormModel',
  components: {
    CustomRender,
    XSelect,
    InputNumber,
    InputNumberRange
  },
  render (h) {
    const _this = this
    const { defaultForms, moreForms, searchParams, more_searchParams, tagList, formModelConfig = {}, popWidth, isDefaultClass, searchHandler, local_deleteTag } = this
    let warpClass = 'xpb-search-form-model'
    if (isDefaultClass) warpClass += ' xpb-search-form-model--default'
    const bindInputEvents = (item, isMore) => {
      if (!isMore) {
        return {
          blur: searchHandler,
          pressEnter: searchHandler
        }
      }
      return {}
    }
    const itemRender = (item, isMore = false) => {
      const { prop, itemType, itemWidth, options, change, itemStyle = '', ...formOthers } = item
      const _options = options || []
      // todo 优化
      const _itemWidth = typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth

      let disabled = item.disabled
      if (disabled === undefined) {
        disabled = false // isEdit === false
      }
      // 优化后的 change事件
      const formatterChange = async () => {
        if (change) {
          return change((isMore ? more_searchParams : searchParams), _options, isMore)
        }
      }
      // 通过change 事件 也触发 searchParams进行更新
      let changeAndSearch = formatterChange
      if (!isMore) {
        changeAndSearch = () => formatterChange().then(searchHandler)
      }
      const moreDefaultWidth = isMore ? '100%' : ''
      switch (itemType) {
        case 'xSelect' :
          return <XSelect
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={item}
            {...{
              on: {
                'update:selected_label': (label) => {
                  _this.xSelectTagsUpdate(label, item, isMore)
                }
              }
            }}
            onChange={changeAndSearch}
            disabled={disabled}
            placeholder={item.placeholder || `请选择${item.label || ''}`}
            width={_itemWidth || (moreDefaultWidth ? '100%' : '') || '160px'}
            // overlayWidth={item.overlayWidth}
          >
          </XSelect>

        case 'render' :
          return <CustomRender
            form={item}
            params={(isMore ? more_searchParams : searchParams)}
          />
        // <!-- compact 自定义_复合类型 -->
        case 'compact':
          var _forms = item.children
          if (Array.isArray(_forms) && _forms.length) {
            return <a-input-group class="render-compact-wrap" compact>
              {_forms.map(v => {
                return itemRender(v, isMore)
              })}
            </a-input-group>
          } else {
            this.$log('compact 自定义复合类型的 children 必须有 children 且 children item 有对应的 itemType配置', 'warning', 'orange')
            return <a-input style="color: #f00;width: 110px;" value="compact渲染err" disabled/>
          }

        // <!-- 下拉框 -->
        case 'select':
          var maxTagCount = typeof item.maxTagCount === 'number' ? item.maxTagCount : 1
          var maxTagTextLength = typeof item.maxTagTextLength === 'number' ? item.maxTagTextLength : 1
          return <a-select
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            maxTagCount={maxTagCount}
            maxTagTextLength={maxTagTextLength}
            onChange={changeAndSearch}
            filterOption={item.filterOption || this.filterOption}
            dropdownMatchSelectWidth={item.dropdownMatchSelectWidth !== false}
            disabled={disabled}
            mode={item.selectMultiple}
            allowClear={item.allowClear !== false}
            placeholder={item.placeholder || `请选择${item.label || ''}`}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '160px'};`}
          >
            {
              _options.map((option, optionIndex) => {
                let value = option
                let label = option
                let disabled = false
                if (typeof option === 'object') {
                  value = option[item.valueKey || 'value']
                  label = option[item.labelKey || 'label']
                  disabled = option.disabled
                }
                return <a-select-option
                  key={value}
                  value={value}
                  title={option[item.labelKey || 'label']}
                  disabled={disabled}>
                  {label}
                </a-select-option>
              })
            }
          </a-select>

        // <!-- 下拉框 - 单选 多选(远程搜索) -->
        case 'fetchSelect':
          return <a-select
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            placeholder={item.placeholder || `请选择${item.label || ''}`}
            showArrow
            allowClear={item.allowClear !== false}
            maxTagCount={1}
            maxTagTextLength={1}
            dropdownMatchSelectWidth={false}
            disabled={disabled}
            filterOption={false}
            notFoundContent={item.isFetch ? undefined : null}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '160px'};`}
            onSearch={($event) => (item.search || function (e) {
              console.log('请添加 search fn', e)
            })($event, item)}
            className="xpb-search-form-model-select"
          >
            {item.isFetch ? <a-spin slot="notFoundContent" size="small" /> : ''}
            {
              _options.map((option, optionIndex) => {
                let value = option
                let label = option
                // let disabled = false
                if (typeof option === 'object') {
                  value = option[item.valueKey || 'value']
                  label = option[item.labelKey || 'label']
                  // disabled = option.disabled
                }
                return <a-select-option
                  key={value}
                  value={value}>
                  {label}
                </a-select-option>
              })
            }
          </a-select>
        // <!-- 单选 -->
        case 'radio':
          return <a-radio-group
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            onChange={changeAndSearch}
            disabled={disabled}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || 'auto'};`}
          >
            {
              _options.map((option, optionIndex) => {
                let value = option
                let label = option
                let disabled = false
                if (typeof option === 'object') {
                  value = option[item.valueKey || 'value']
                  label = option[item.labelKey || 'label']
                  disabled = option.disabled
                }

                return <a-radio-button
                  key={optionIndex + '_local'}
                  value={value}
                  disabled={disabled}>
                  {label}
                </a-radio-button>
              })
            }
          </a-radio-group>
        // <!-- 时间月份 -->
        case 'monthPicker':
          return <a-month-picker
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            onChange={changeAndSearch}
            disabled={disabled}
            allowClear={item.allowClear !== false}
            valueFormat={item.valueFormat || 'YYYY-MM'}
            placeholder={item.placeholder || '请选择月份'}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '160px'};`}
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-month-picker>
        // <!-- 单日期 -->
        case 'datePicker':
          return <a-date-picker
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            onChange={changeAndSearch}
            disabled={disabled}
            allowClear={item.allowClear !== false}
            valueFormat={item.valueFormat || 'YYYY-MM-DD'}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '160px'};`}
          ><a-icon slot="suffixIcon" type="calendar" /></a-date-picker>
        // <!-- 日期区间 -->
        case 'rangePicker':
          var calendarChange = item.calendarChange || function (data) {}
          var openChange = item.openChange || function (status) {}
          return <a-range-picker
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            onChange={changeAndSearch}
            onCalendarChange={calendarChange}
            onOpenChange={openChange}
            disabled={disabled}
            allowClear={item.allowClear !== false}
            valueFormat={item.valueFormat || 'YYYY-MM-DD'}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '200px'};`}
          ><a-icon slot="suffixIcon" type="calendar" /></a-range-picker>
        // <!-- 文本域 -->
        case 'textarea':
          //  <!-- textarea -->
          var autoSize = formOthers.autoSize === undefined ? { minRows: 2, maxRows: 3 } : formOthers.autoSize
          // autoSize={autoSize}
          var onEvents = bindInputEvents(item, isMore)
          // 对 change 事件进行 统一管理
          return <a-textarea
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            props={{ ...formOthers }}
            autoSize={autoSize}
            onChange={formatterChange}
            on={onEvents}
            disabled={disabled}
            placeholder={item.placeholder || `请输入${item.label || ''}`}
            allowClear={item.allowClear !== false}
            style={`width: 300px; height: 32px; ${itemStyle} width:${_itemWidth || moreDefaultWidth};`}
          />

        // <!-- 数值文本框 范围 -->
        case 'inputNumberRange':
          var precision = item.precision || 0
          var localStyle = `${itemStyle} width:${_itemWidth || moreDefaultWidth || '100px'};`
          var localParams = isMore ? more_searchParams : searchParams
          var numberChange = (e, propKey) => {
            change && change((isMore ? more_searchParams : searchParams), _options, isMore, propKey)
          }
          return <InputNumberRange
            v-model={localParams}
            prop={prop}
            attrs={{ ...formOthers }}
            on={bindInputEvents(item, isMore)}
            onChange={numberChange}
            disabled={disabled}
            precision={precision}
            itemStyle={localStyle}
          >
          </InputNumberRange>
        // <!-- 数值文本框 -->
        case 'inputNumber':
          var onEvents_ = bindInputEvents(item, isMore)
          return <InputNumber
            class="rate100"
            v-model={(isMore ? more_searchParams : searchParams)[prop]}
            attrs={{ ...formOthers }}
            on={onEvents_}
            onChange={formatterChange}
            disabled={disabled}
            placeholder={item.placeholder || `请输入${item.label || ''}`}
            precision={item.precision || 0}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth || '130px'};`}
          />
        // <!-- 文本框 -->
        case 'input':
        default:
          return isMore ? <a-input
            v-model={more_searchParams[prop]}
            props={{ ...formOthers }}
            onChange={formatterChange}
            disabled={disabled}
            placeholder={item.placeholder || `请输入${item.label || ''}`}
            allowClear={item.allowClear !== false}
            style={`${itemStyle} width:${_itemWidth || moreDefaultWidth};`}
          /> : <a-input-search
            class="default-input"
            v-model={searchParams[prop]}
            props={{ ...formOthers }}
            onChange={formatterChange}
            onSearch={searchHandler}
            onPressEnter={searchHandler}
            disabled={disabled}
            placeholder={item.placeholder || `请输入${item.label || ''}`}
            allowClear={item.allowClear !== false}
            style={`${itemStyle} width:${_itemWidth || '160px'};`}
          />
      }
    }
    // 找出展示的更过筛选长度
    const moreFormsFlag = moreForms.filter(v => v.visible !== false).length
    const _render = (item) => {
      // 仅在有label 且defaultForm 中showLabel 进行展示
      if (item.showLabel && item.label) {
        return <a-input-group class="show-label-wrap" compact>
          <span class="item-label">{item.label}</span>
          {itemRender(item, false)}
        </a-input-group>
      }
      return itemRender(item, false)
    }
    return <div class={warpClass}>
      <div class="xpb-search-form-model-forms-wrap">
        <a-form-model
          ref="customForm"
          layout="inline"
          colon={false}
          props={{ model: searchParams, ...formModelConfig }}
        >
          {
            defaultForms.map((item, idx) => {
              // 通过 form.visible 控制 是否展示
              return <a-form-model-item
                v-show={item.visible !== false}
                key={idx}
              >
                {_render(item)}
              </a-form-model-item>
            })
          }
          <div class="more-form-wrap">
            { /* 更多formItem 以及 展示更多按钮 */ }
            <div
              ref="popViewFormRef"
              class="more-form-pop"
              v-show={this.popVisible && moreFormsFlag}
              style={{ width: popWidth }}
            >
              <div class="more-form-pop_content">
                {
                  moreForms.map((item, idx) => {
                    let label = item.label || ''
                    if (item.itemType === 'compact') label = '' // 是复合类型的不默认展示 label
                    return <div class="more-item"
                      v-show={item.visible !== false}
                      key={idx}
                    >
                      {
                        label ? <div title={label} class={`more-item_label ${label.length > 6 ? 'text-overflow_ellipsis_line_2' : ''}`}>
                          {label}
                        </div> : ''
                      }
                      <div class="more-item_value-wrap">
                        {itemRender(item, true)}
                      </div>
                    </div>
                  })
                }
              </div>
              <div class="more-form-pop_button">
                <a-button type="default" onClick={this.moreClose}>关闭</a-button>
                <a-button type="primary" style='margin-left:10px' onClick={this.moreSearch}>
                  搜索
                </a-button>
              </div>
            </div>
            {
              moreFormsFlag ? <div class="icon-button-box" ref="showMoreRef">
                <a-tooltip title="更多筛选条件">
                  <a-button onClick={ () => (this.showMore())}>
                    <i class="xpb-iconfont xpb-search-filter" />
                  </a-button>
                </a-tooltip>
              </div> : ''
            }
            { /* 重置按钮 */ }
            {
              this.clearBtnVisible ? <div class="icon-button-box">
                <a-tooltip title="清空搜索条件">
                  <a-button onClick={this.local_resetHandler}>
                    <i class="xpb-iconfont xpb-search-clear" />
                  </a-button>
                </a-tooltip>
              </div> : ''
            }
          </div>
        </a-form-model>
      </div>
      {/* 更多标签 start */ }
      <div v-show={tagList.length > 0} class="xpb-search-form-model-tags">
        {
          tagList.map((item, index) => {
            const _value = item.value
            const local_label = item.label
            let local_label2value = `${local_label}：${_value}`
            // 针对更多(isMore itemType: compact)复合类型 根据搜索的数据 进行自定义tag展示
            if (typeof item.compact_moreTagRender === 'function') {
              const { children } = item.form
              if (!searchParams[children[0].prop]) return
              local_label2value = item.compact_moreTagRender({
                searchParams,
                label: item.label,
                value: item.value
              }) // 类似这样的格式： `${local_label}：${_value}`
              return <a-tag>
                {local_label2value}
                <a-icon type="close" class="icon-delete" onClick={local_deleteTag.bind(null, item, index)} />
              </a-tag>
            }
            if (Array.isArray(_value)) {
              const _valueLength = _value.length
              return <a-tag>
                {item.label}：
                {_valueLength > 3 ? <a-popover overlayClassName="xpb-search-form-model-tags_popover" placement="bottom">
                  <vxe-list
                    slot="content"
                    height={_valueLength > 10 ? '300px' : 'auto'}
                    class="local_list"
                    data={_value}
                    scopedSlots={{
                      default: ({ items }) => items.map((v, idx) => {
                        return <div title={v} class="item text-overflow_ellipsis">{v}</div>
                      })
                    }}
                  >
                  </vxe-list>
                  <span>
                    {_value[0]}，{ _value[1]}，{_value[2]}，+({_valueLength - 3}项)
                  </span>
                </a-popover>
                  : _value.map((v, idx) => {
                    return `${v}${(_valueLength - 1) === idx ? '' : ','}`
                  })
                }
                <a-icon type="close" class="icon-delete" onClick={local_deleteTag.bind(null, item, index)}/>
              </a-tag>
            } else {
              return <a-tag>
                {local_label2value}
                <a-icon type="close" class="icon-delete" onClick={local_deleteTag.bind(null, item, index)} />
              </a-tag>
            }
          })
        }
      </div>
      { /* 更多标签 end */}
    </div>
  },
  model: {
    prop: 'searchParams',
    event: 'update:searchParams'
  },
  props: {
    forms: {
      type: Array,
      required: true
    },
    // 后台传递的初始值 以及 双向绑定 对象
    searchParams: {
      required: true,
      type: Object
    },
    // 是否添加默认样式 page样式
    isDefaultClass: {
      type: Boolean,
      default: false
    },
    // 是否展示清除按钮
    clearBtnVisible: {
      type: Boolean,
      default: true
    },
    // 多选标签 展示
    tagsVisible: {
      type: Boolean,
      default: true
    },
    // 删除标签后的 额外操作(用于： 可能对searchParams 数据进行调整)
    deleteTag: {
      type: Function // (form) => {} // 当前的 form配置
    },
    // 更多 弹窗width
    popWidth: {
      type: String,
      default: '360px'
    }
  },
  data () {
    return {
      defaultForms: [],
      moreForms: [],
      more_searchParams: {},
      tagList: [],
      xSelectTags: {}, // xSelect 存储
      popVisible: false
    }
  },
  computed: {
  },
  watch: {
    searchParams: {
      handler (data, old) {
        if (!this.initSearchParams) {
          this.initSearchParams = { ...data }
        }
        this.more_searchParams = { ...data }
        // this.more_searchParamsReset()
      },
      immediate: true
    },
    forms: {
      handler () {
        // 对forms 根据 isMore 判断 进行分类
        const defaultForms = []
        const moreForms = []
        this.forms.map(form => {
          if (form.isMore) {
            moreForms.push(form)
            // get moreForms keys
          } else {
            defaultForms.push(form)
          }
        })
        this.defaultForms = defaultForms
        this.moreForms = moreForms
        this.moreFormKeys = moreForms.reduce((keys, form) => {
          return keys.concat(this.queryItemTypeKey(form))
        }, [])
      },
      immediate: true
    }
  },
  created () {
    // 监听 父级调用XSearchFormModel 的 内部方法 触发
    this.$on('XSearchFormModelAction', (handlerArr = [], params) => {
      // console.log(handlerArr, 'XSearchFormModelAction handlerArr params', params)
      setTimeout(() => {
        const fn = getDeepValue(this, handlerArr)
        if (typeof fn === 'function') {
          if (params !== undefined) {
            fn(params)
          } else {
            fn()
          }
        }
      }, 0)
    })
  },
  mounted () {
    if (this.moreForms.length) {
      window.addEventListener('resize', this.updatePosition)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updatePosition)
  },
  methods: {
    queryItemTypeKey (item) {
      const { prop, itemType } = item
      switch (itemType) {
        case 'render':
          /** !!! 暂不对render类型 进行更多标签处理 todo */
          return []
        // 对Number区间进行特殊处理
        case 'inputNumberRange':
          var propStart = item.propStart || `${prop}Start`
          var propEnd = item.propEnd || `${prop}End`
          return [propStart, propEnd]
        case 'xSelect':
        case 'select':
        case 'fetchSelect':
        case 'radio':
        case 'rangePicker':
        case 'monthPicker':
        case 'datePicker':
        case 'inputNumber':
        case 'input':
        case 'textarea':
        default:
          return [prop]
      }
    },
    more_searchParamsReset () {
      const keys = this.moreFormKeys || []
      const searchParams = this.searchParams || {}
      this.more_searchParams = keys.reduce((res, key) => {
        res[key] = searchParams[key]
        return res
      }, {})
    },
    // 更新标签展示
    updateTagList () {
      if (!this.tagsVisible) return
      const tags_forms = []
      this.defaultForms.map(v => {
        if (v.itemType === 'xSelect') {
          tags_forms.push(v)
        }
      })
      tags_forms.push(...this.moreForms)
      // 对需要渲染的 forms 进行遍历
      /**
       * 声明：
       * compact 类型 内嵌的暂不做展示处理  (be todo 可以根据内部的children 进行遍历处理 也可以挂载在 compact 这个上面处理)
       *
       */
      const formData = this.searchParams

      this.tagList = tags_forms.reduce((res, item) => {
        // prop   label   value
        const getItemValue = (item) => {
          const { prop, itemType, options: _options } = item
          const options = _options || []
          const val = formData[prop]
          let localValue
          switch (itemType) {
            case 'compact':
              var _forms = item.children
              if (Array.isArray(_forms) && _forms.length) {
                localValue = _forms.map(v => getItemValue(v))
              }
              break
            case 'xSelect':
              localValue = this.xSelectTags[prop]
              if (Array.isArray(localValue) && !localValue.length) {
                localValue = undefined
              } else if (localValue === '') {
                localValue = undefined
              }
              // localValue = val
              break
            // 对应的 prop 进行 提取 select_label
            case 'render':
              /** !!! 暂不对render类型 进行更多标签处理 */
              break
            case 'select':
            case 'fetchSelect':
            case 'radio':
              if (Array.isArray(val)) {
                localValue = []
                // 如果当前选中的值为空，或者有值且没有一项都存在于当前下拉选项中（如由于换账号，或者删除账号导致），则删除或不处理
                if (val.length) {
                  val.map(_val => {
                    options.map(option => {
                      const value = (typeof option === 'object') ? option[item.valueKey || 'value'] : option
                      if (value === _val) {
                        const label = (typeof option === 'object') ? option[item.labelKey || 'label'] : option
                        localValue.push(label)
                      }
                    })
                  })
                  // 若获取不到数据强制去除
                  if (!localValue.length) localValue = undefined
                }
              } else {
                options.find(option => {
                  const value = (typeof option === 'object') ? option[item.valueKey || 'value'] : option
                  if (value === val) {
                    localValue = (typeof option === 'object') ? option[item.labelKey || 'label'] : option
                  }
                })
              }
              break
            case 'rangePicker':
              if (Array.isArray(val) && val.length) {
                localValue = val.join('~')
              }
              break
            // 对Number区间进行特殊处理
            case 'inputNumberRange':
              var varStart = formData[item.propStart || `${prop}Start`]
              var varEnd = formData[item.propEnd || `${prop}End`]
              if (typeof varStart === 'number') {
                localValue = (!varEnd) ? ('>= ' + varStart) : varStart
              }
              if (typeof varEnd === 'number') {
                if (localValue === undefined) {
                  localValue = '<= ' + varEnd
                } else {
                  localValue += '~' + varEnd
                }
              }
              break
            case 'monthPicker':
            case 'datePicker':
            case 'inputNumber':
            case 'input':
            case 'textarea':
            default:
              localValue = val
              break
          }
          return localValue
        }
        const localValue = getItemValue(item)
        if (localValue !== undefined) {
          res.push({
            label: item.label,
            compact_moreTagRender: item.compact_moreTagRender, // 针对更多展示 复合类型 根据搜索的数据 进行自定义tag展示
            value: localValue,
            form: item
          })
        }
        return res
      }, [])
      this.popVisible = false
    },
    // 删除标签展示 以及相关数据
    async local_deleteTag (item, index) {
      // const form = this.tagList[index].form
      const { form } = item
      const get_extraParams = (form) => {
        let extraParams = {}
        const { prop, itemType } = form
        switch (itemType) {
          case 'compact':
            var _forms = form.children
            extraParams = { [_forms[0].prop]: undefined } // 先清空组合搜索条件第一个属性
            if (Array.isArray(_forms) && _forms.length) {
              _forms.slice(1).map(v => {
                extraParams = { ...extraParams, ...get_extraParams(v) }
              })
            }
            break
          case 'inputNumberRange':
            var propStart = form.propStart || `${prop}Start`
            var propEnd = form.propEnd || `${prop}End`
            extraParams = { [propStart]: undefined, [propEnd]: undefined }
            break
          default:
            extraParams = { [prop]: undefined }
        }
        return extraParams
      }
      const extraParams = get_extraParams(form)
      const new_searchParams = { ...this.searchParams, ...extraParams }
      // 关闭tag 后涉及到的额外联动操作(用于：对即将生成的新 searchParams 数据进行调整)
      if (typeof this.deleteTag === 'function') {
        await this.deleteTag(form, new_searchParams)
      }
      // 删除当前标签
      this.tagList.splice(index, 1)
      // 对当前的 prop 进行重置
      this.$emit('update:searchParams', new_searchParams)
    },
    // 重置
    async local_resetHandler () {
      // 若有reset 将不会触发默认重置的操作
      const emitReset = this.$listeners.reset
      if (emitReset) {
        await emitReset({ ...this.initSearchParams })
      } else {
        // this.$refs.customForm.resetFields()
        // 撤回为初始化状态
        this.$emit('update:searchParams', { ...this.initSearchParams })
      }
      this.$nextTick(this.updateTagList)
    },
    searchHandler () {
      this.$emit('update:searchParams', { ...this.searchParams })
      // this.$nextTick(this.updateTagList)
    },
    moreSearch () {
      this.popVisible = false
      this.$emit('update:searchParams', { ...this.searchParams, ...this.more_searchParams })
      this.$nextTick(this.updateTagList)
    },
    moreClose () {
      this.popVisible = false
      // 关闭后 将搜索重置
      this.more_searchParams = { ...this.searchParams }
    },

    // 更新更多弹窗位置
    updatePosition () {
      if (!this.popVisible) return
      const winWidth = window.innerWidth
      const rect = this.$refs.showMoreRef.getBoundingClientRect()
      const popRef = this.$refs.popViewFormRef
      const clientWidth = popRef.clientWidth

      if (rect.left < clientWidth) {
        popRef.classList.remove('is-right')
        popRef.classList.add('is-left')
      } else if (rect.right + clientWidth / 2 > winWidth) {
        popRef.classList.remove('is-left')
        popRef.classList.add('is-right')
      } else {
        popRef.classList.remove('is-left')
        popRef.classList.remove('is-right')
      }
    },
    showMore () {
      this.popVisible = true
      this.$nextTick(() => {
        this.updatePosition()
      })
    },
    // select框过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    xSelectTagsUpdate (label, item, isMore) {
      this.xSelectTags[item.prop] = label
      if (!isMore) {
        this.updateTagList()
      }
    }
  }
}
/**
 XSearchFormModel的 组件配置
 // 表单配置
 forms > form.itemType:(包含类型)
 // compact(自定义组合类型 以下所有单类型)
 // xSelect(支持多选/单选 支持本地搜索组件)
 // render(自定义渲染)
 // select(ant select类型)
 // fetchSelect(ant select 封装fetch类型)
 // radio(ant radio (radio-button) 类型)
 // monthPicker(ant month-picker 类型)
 // datePicker(ant date-picker 类型)
 // rangePicker(ant range-picker 类型)
 // textarea(ant textarea 类型)
 // inputNumber(ant input-number 封装的InputNumber 类型)
 // inputNumberRange(ant input-number 封装的InputNumber 区间 类型)
 // input (ant input 类型)

 forms = [
 // {
 //        label: '展示的label',
 //        // showLabel: true, // 默认不展示 (仅在有label 且 未配置 isMore=true showLabel 才进行展示)
 //        // isMore: false, // 是否将当前选项放置 更多当中
 //        // visible: false, // 是否展示当前 form 判断
 //        prop: '提交的model prop',
 //        itemType: 'input', // 渲染类型 (见 form.itemType)
 //        itemWidth: 100, // (Number, String) 宽度设置
 //        itemStyle: 'background: #f00;color:#00f;', // 自定义设置样式
 //        placeholder: '', // 大部分情况下可以使用 label 替代 如有特殊请设置
 //        // 以上为默认公用配置
 //        // otherProps: ... 涉及到其他的配置相关 请参考对应的类型配置
 //    },
 { // xSelect (支持多选/单选 支持本地搜索组件)
            label: '账号',
            prop: 'user_account',
            itemType: 'xSelect',
            multiple: true, // 是否多选 判断
            options: [], // 下拉配置 {[labelKey]: label, [valueKey]: value, disabled: Bool, visible: Bool(于 xSelect 控制是否隐藏) }
            valueKey: 'user_account', // options 提交的key
            labelKey: 'user_account', // options 展示的key
            overlayWidth: '200px' // 内部pop弹窗的with
    },
 { // render (自定义渲染)
            label: '自定义render',
            prop: 'renderKey',
            itemType: 'render',
            render: (h, extendsParams) => {
              const { form, params } = extendsParams
              return <a-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
            }
    },
 { // compact (自定义_复合类型)
            label: 'select_input',
            itemType: 'compact',
            children: [ {
                prop: 'compact_select',
                label: 'compact_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                itemWidth: '90px'
              },
              {
                prop: 'compact_input',
                label: 'compact_input',
                itemType: 'input',
                itemWidth: '190px',
                placeholder: '支持模糊搜索'
              }
            ]
    },
 { // select (下拉框)
            prop: 'select',
            label: 'select',
            itemType: 'select',
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ],
            // labelKey: 'label', // 默认 label
            // valueKey: 'value', // 默认 value
            change(param, _options, isMore) {}
            // 其他的 请参考 a-select 的配置
    },
 { // fetchSelect (单选 多选(远程搜索))
            prop: 'fetchSelect', // 提交的 params 的字段
            label: 'fetchSelect', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ],
            // labelKey: 'label', // 默认 label
            // valueKey: 'value', // 默认 value
            isFetch: false, // 是否请求中判断
            search: debounce((val, item) => {
                 item.options = []
                item.isFetch = true
                yourFetch(val).then(data => item.options = data)finally(_ => {
                  item.isFetch = false
                })
            }, 500)
            // 其他的 请参考 a-select 的配置
    },
 { // radio (单选)
            prop: 'fetchSelect', // 提交的 params 的字段
            label: 'fetchSelect', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ],
            // labelKey: 'label', // 默认 label
            // valueKey: 'value', // 默认 value
    },
 { // monthPicker (时间月份)
            prop: 'monthPicker',
            label: 'monthPicker',
            itemType: 'monthPicker',
            // valueFormat: 'YYYY-MM' // 默认
    },
 { // datePicker (单日期)
            prop: 'datePicker',
            label: 'datePicker',
            itemType: 'datePicker',
            // valueFormat: 'YYYY-MM-DD' // 默认
    },
 { // rangePicker (日期区间)
            prop: 'rangePicker',
            label: 'rangePicker',
            itemType: 'rangePicker',
            // valueFormat: 'YYYY-MM-DD' // 默认
    },
 { // textarea (文本域)
            prop: 'textarea',
            label: 'textarea',
            itemType: 'textarea'
    },
 { // inputNumber (数值文本框)
            prop: 'inputNumber',
            label: 'inputNumber',
            itemType: 'inputNumber',
            addonBefore: '展示前缀',
            addonAfter: '展示后缀',
            // 其他的 请参考 a-input-number 的配置
    },
 { // inputNumberRange (数值文本框 区间)
            prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
            // propStart: 'inputNumberRange_start',
            // propEnd: 'inputNumberRange_end',
            label: 'inputNumberRange',
            itemType: 'inputNumberRange',
            addonBefore: '展示前缀',
            addonAfter: '展示后缀',
            // 其他的 请参考 a-input-number 的配置
    },
 { // input (文本框)
            prop: 'input',
            label: 'input',
            itemType: 'input'
          }
 ]
 */
/*
<XSearchFormModel
    :searchParams.sync="searchParams" // 方式1
    v-model="searchParams" // 方式2
    isDefaultClass 是否添加默认page样式
    clearBtnVisible 是否展示清除按钮
    tagsVisible 是否展示 多选标签 展示
    popWidth 更多 弹窗width
    @reset="resetHandler" reset重置 // (initParams) => { you want to do }
/>
*/
</script>
