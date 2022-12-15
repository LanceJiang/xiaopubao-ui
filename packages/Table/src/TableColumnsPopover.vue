<!-- 多语言支持 需要调整todo -->
<template>
  <a-popover
    :trigger="['click']"
    :visible="comp_visible"
    @visibleChange="visibleChange"
    :getPopupContainer="getPopupContainer"
    overlayClassName='xpb-column-popover'
    :placement="placement">
    <slot><a-button>自定义列</a-button></slot>
    <template #content>
      <a-spin :spinning="loading">
        <!-- 自定义Modal 标题 -->
        <header class="header">
          <slot name="title">{{title}}</slot>
        </header>
        <div :class="{ 'xpb-column-popover_content': true, 'xpb-column-popover_content-sort': sortable}">
          <header class="header">
            选择字段

            <a-radio-group v-model="topActionType" style='margin-left: auto;' :options="[
              { label: '全选', value: 'onCheckAllChange' },
              { label: '取消选择', value: 'onCheckClearAllChange' },
              { label: '反选', value: 'onCheckReverseChange' },
              ]" @change="topAction" />
            <!--<a-checkbox style="margin-left: auto;" :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
            <span @click="onCheckClearAllChange" class='link' style='padding-right: 8px;font-size: 12px;'>取消选择</span>
            <a-checkbox :checked="checkReverse" @change="onCheckReverseChange">
              反选
            </a-checkbox>-->
          </header>
          <div class='leftBox'>
            <template v-if="isChildrenType">
              <div class="boxWrap" v-for="(v, index) in columns" :key="v.title" :class="{'no-padding': index === 0}">
                <header class="title">
                  <a-checkbox class="title_checkBox" :indeterminate="v.indeterminate" :checked="v.checkAll" @change="onCheckAllChangeByGroup($event, v)">
                    {{v.title}}
                  </a-checkbox>
                </header>
                <div style="padding-left: 16px;">
                  <a-checkbox-group
                    class="checkGroup"
                    :value="checkedList"
                    @change="onChangeByGroup($event, v)"
                  >
<!--                    :options="v.children"-->
                    <a-checkbox v-for='option of v.children' :key='option.field' :value="option.field">
                      {{ t(v.title) }}
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </div>
            </template>
            <a-checkbox-group
              v-else
              class="checkGroup"
              :value="checkedList"
              @change="onChange"
            >
<!--              :options="flatColumns"-->
              <a-checkbox v-for='v of flatColumns' :key='v.field' :value="v.field">
                {{ t(v.title) }}
              </a-checkbox>
<!--              checkbox-group-->
            </a-checkbox-group>
          </div>
          <div v-if="sortable" class="rightBox">
            <header class="header">已选字段排序</header>
            <Draggable_Nest
              v-model="checkedOptions"
              :move="onMove"
              :setFixed="setFixed"
              :delCheckedColumn="delCheckedColumn"
            >
            </Draggable_Nest>
            <div class="list-group_empty" v-show="!checkedOptions.length">暂无数据~</div>
          </div>
        </div>
        <div class="footer">
          <a-button @click="resetDefault">恢复默认</a-button>
          <a-button style="margin-left: auto;margin-right: 10px;" @click="closeDialog">取消</a-button>
          <a-button type="primary" @click="submitHandler">保存</a-button>
        </div>
      </a-spin>
    </template>
  </a-popover>
</template>
<script>
import { t } from 'xiaopubao-ui/src/locale'
import Draggable from 'vuedraggable'
import Locale from 'xiaopubao-ui/src/mixins/locale'

const Draggable_Nest = {
  name: 'Draggable_Nest',
  components: {
    Draggable
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: {
      required: false,
      type: Array,
      default: null
    },
    list: {
      required: false,
      type: Array,
      default: null
    },
    // 设置定位(置顶/底)
    setFixed: {
      type: Function,
      default: (...args) => {}
    },
    delCheckedColumn: {
      type: Function,
      default: (...args) => { console.error(args, 'delCheckedColumn') }
    },
    move: {
      type: Function,
      default: (...args) => { console.error(args, 'move') }
    }
  },
  render() {
    return <Draggable
      class='list-group'
      props={this.dragOptions}
      animation={280}
      ghost-class='ghost'
      chosen-class='chosen'
      list={this.list}
      value={this.value}
      onInput={this.emitter}
      move={this.move}>
      <transition-group>
        {this.realValue.map((v, index) => {
          const _title = t(v.title)
          return <div
            class="list-group-item"
            key={v.field}
          >
            <div class={['itemWrap', `${v.fixed ? 'disabled' : ''}`]}>
              <span class="xpb-iconfont xpb-drag-el dragEl"/>
              <span class="label_txt" title={_title}>{ _title }</span>
              <a-icon onClick={this.delCheckedColumn.bind(null, this.realValue, index)} class="delEl" type="close" />
              {
                (this.level === 0 && v._fixed) ? <span class='disabled_fixed' onClick={this.setFixed.bind(null, v, this.level)}>置{v._fixed === 'left' ? '底' : '顶'}</span>
                  : ''
              }
            </div>
            <Draggable_Nest
              move={this.move}
              delCheckedColumn={this.delCheckedColumn}
              level={this.level + 1}
              list={v.children || []}
            />
          </div>
        })}
      </transition-group>
    </Draggable>
  },
  data() {
    return {
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  computed: {
    realValue() {
      return this.value ? this.value : this.list
    }
  },
  methods: {
    emitter(value) {
      this.$emit('input', value)
    }
  }
}
export default {
  name: 'XTableColumnsPopover',
  mixins: [Locale],
  components: {
    Draggable_Nest
  },
  props: {
    visible: {
      type: Boolean,
      default: undefined
    },
    // 配置列表
    columns: {
      required: true,
      type: Array,
      default: () => []
      /**
       * eg: [
       * { title: column的标题【String】,
       *   field: column的field【String】(value),
       *   fixed: 控制column是否固定fixed【Boolean】 (disabled),
       *   _fixed: 标记column是否有置顶置底置换功能【left/right】,
       *   dynamic: 标记column是否根据本地的column进行title替换【Boolean】}
       * ]
       */
    },
    value: {
      // 类 columns 配置
      type: Array
      // default: () => []
      // todo dynamic: 标记column是否根据本地的column进行title替换【Boolean】
      /* type Options = { title: string; field: string; fixed: boolean|string }[] */
    },
    // 没有存储数据时 系统给予的默认配置
    defaultCheckedOptions: {
      // 同value 配置
      type: Array,
      default: null
    },
    // 右侧栏排序列表是否展示
    sortable: {
      type: Boolean,
      default: true
    },
    // 弹窗title
    title: {
      type: String,
      default: '自定义列表字段'
    },
    // 确认提交前 是否允许提交 flag 判断方法
    submit: {
      type: Function,
      default: function (childComp) {
        // 示例
        console.error('childComp', childComp)
        // 接口请求 然后 处理...
        const options = childComp.checkedOptions
        if (Array.isArray(options) && !options.length) return this.$message.warn('请至少选中一个选项~')
        childComp.loading = true
        setTimeout(() => {
          console.warn('todo...... checkedOptions', childComp.checkedOptions)
          // fetchEditColumnsList({
          //   // ...params,
          //   options
          // }).then(res => {
          //   if (res.error) return this.$message.error(res.message)
          this.$message.success('列表自定义配置成功~')
          // this.$emit('getCustomColumns', options)
          childComp.closeDialog()
          // }).finally(_ => {
          //   childComp.loading = false
          // })
        }, 500)
        // this.cusColumns = options.map(field => columns.find(v => v.field === field))
      }
    },
    placement: {
      type: String,
      default: 'topLeft'
    },
    getPopupContainer: {
      type: Function,
      default: (triggerNode) => triggerNode.parentNode
    }
  },
  data() {
    return {
      localVisible: false,
      topActionType: undefined,
      // indeterminate: false,
      // checkAll: false,
      // checkReverse: false,
      // checkClearAll: false,
      checkedOptions: [],
      loading: false,
      checkedList: [],
      isChildrenType: false
    }
  },
  computed: {
    comp_visible () {
      if (typeof this.visible !== 'boolean') return this.localVisible
      return this.visible
    },
    // 分组类型配置项(2级) 进行扁平化处理
    flatColumns() {
      return this.columns.reduce((res, cur) => {
        let curArr = []
        // [警告]仅支持内嵌一层数组
        if (cur.children) {
          curArr = cur.children
        } else {
          curArr = [cur]
        }
        return res.concat(curArr)
      }, [])
    }
  },
  watch: {
    value: {
      // immediate: true, // columns
      handler(value) {
        console.warn('value 变更 监听', value, this.localVisible)
        // if (this.visible) {
        if (this.localVisible) {
          this.initCheckedOptions()
        }
      }
    },
    // visible(bool) {
    localVisible(bool) {
      console.error('visible change', bool)
      if (bool) {
        this.initCheckedOptions()
      }
    },
    columns: {
      handler(options) {
        if (options.length && options[0].children) {
          this.isChildrenType = true
        } else {
          this.isChildrenType = false
        }
      },
      immediate: true
    }
  },
  created() {
    // window.$customColumnPopover = this
  },
  methods: {
    visibleChange(visible) {
      this.$emit('update:visible', visible)
      this.localVisible = visible
    },
    getCheckedOptions (options = this.checkedOptions) {
      const topFixed = []
      const topList = []
      const bottomFixed = []
      const checkedOptions = JSON.parse(JSON.stringify(options))
      for (let i = 0; i < checkedOptions.length; i++) {
        const v = checkedOptions[i]
        if (v.fixed) {
          // 置顶功能配置项
          if (v._fixed) {
            // left: 置顶, right: 置底
            (v._fixed === 'left' ? topFixed : bottomFixed).push(v)
          } else {
            // 默认置顶 排列于 配置置顶之后
            topList.push(v)
          }
          checkedOptions.splice(i, 1)
          i--
        }
      }
      const res = topFixed.concat(topList, checkedOptions, bottomFixed)
      // console.log(res.map(v => v.field), 'checkedList ............. checkedOptions', checkedOptions)
      this.checkedList = res.map(v => v.field)
      this.checkedOptions = res
      return res
    },
    initCheckedOptions() {
      this.topActionType = undefined
      // todo init
      let checkedOptions = null
      if (this.value.length) {
        const _data = this.value.filter(v => this.flatColumns.some(_v => _v.field === v.field))
        // 拿出定义了 置顶置底 的项列表 对项目 columns配置 进行重置
        const _fixedList = _data.filter(v => v._fixed)
        _fixedList.map(v => {
          const cur = this.flatColumns.find(_v => v.field === _v.field)
          if (cur) {
            cur._fixed = v._fixed
          }
        })
        // 如果是动态获取的column 配置 通过 dynamic 标识 使用本地最新的配置
        _data.map(v => {
          if (v.dynamic) {
            v.title = (this.flatColumns.find(_v => v.field === _v.field) || {}).title || v.title
          }
        })
        checkedOptions = _data
      }
      // 若查不到配置数据 获取系统默认配置
      if (!checkedOptions) {
        // 若存在 自定义配置（根据产品给的默认展示配置）
        if (Array.isArray(this.defaultCheckedOptions)) {
          checkedOptions = this.defaultCheckedOptions
        } else {
          checkedOptions = JSON.parse(JSON.stringify(this.flatColumns))
        }
      }
      console.error(checkedOptions, 'checkedOptions  defaultCheckedOptions')
      this.getCheckedOptions(checkedOptions)
      this.checkAllCheckAllByGroup()
      // if (this.visible) this.loading = true
      /* fetchColumnsList(params).then(res => {
        const { data, error, message } = res
        if (error) return this.$message.info(message)
        // if (error) console.log(message, 'message')
        let checkedOptions = null
        if (data.length) {
          const _data = data.filter(v => this.flatColumns.some(_v => _v.field === v.field))
          // 拿出定义了 置顶置底 的项列表 对项目 columns配置 进行重置
          const _fixedList = _data.filter(v => v._fixed)
          _fixedList.map(v => {
            const cur = this.flatColumns.find(_v => v.field === _v.field)
            if (cur) {
              cur._fixed = v._fixed
            }
          })
          // 如果是动态获取的column 配置 通过 dynamic 标识 使用本地最新的配置
          _data.map(v => {
            if (v.dynamic) {
              v.title = (this.flatColumns.find(_v => v.field === _v.field) || {}).title || v.title
            }
          })
          checkedOptions = _data
        }
        // console.log(JSON.stringify(this.flatColumns), 'this.flatColumns created')
        // console.log(JSON.stringify(_data), 'data created')
        // 若查不到配置数据 获取系统默认配置
        if (!checkedOptions) {
          // 若存在 自定义配置（根据产品给的默认展示配置）
          if (Array.isArray(this.defaultCheckedOptions)) {
            checkedOptions = this.defaultCheckedOptions
          } else {
            checkedOptions = JSON.parse(JSON.stringify(this.flatColumns))
          }
        }

        this.getCheckedOptions(checkedOptions)
        this.checkAllCheckAllByGroup()
        if (this.visible) {
          // const listLength = checkedOptions.length
          // const columnsLength = this.flatColumns.length
          // this.indeterminate = !!listLength && listLength < columnsLength
          // this.checkAll = listLength === columnsLength
        } else {
          // 仅在初始化的时候 才进行重新匹配获取
          this.$emit('getCustomColumns', this.checkedOptions)
        }
      }).finally(_ => {
        this.loading = false
      }) */
    },
    closeDialog() {
      this.visibleChange(false)
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // fixed 表示 固定的项
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    delCheckedColumn(list, index) {
      list.splice(index, 1)
      // this.checkedOptions.splice(index, 1)
      this.getCheckedOptions()
      // this.indeterminate = !!this.checkedOptions.length
      // this.checkAll = false
    },
    setFixed(v) {
      const _fixed = v._fixed
      if (_fixed === 'left') {
        v._fixed = 'right'
      } else {
        v._fixed = 'left'
      }
      this.getCheckedOptions()
    },
    // 单选
    onChange(list) {
      const columns = this.flatColumns
      const checkedOptions = this.checkedOptions
      // const listLength = list.length
      // 删除 已被取消的项目
      for (let i = 0; i < checkedOptions.length; i++) {
        const v = checkedOptions[i]
        const _index = list.findIndex(field => v.field === field)
        // 如果当前项目在 新的 checkedOptions 找不到 进行删除
        if (_index === -1) {
          checkedOptions.splice(i, 1)
          i--
        } else {
          // 找的到相同的 就把该项目删除 减少下次遍历的次数
          list.splice(_index, 1)
        }
      }
      checkedOptions.push(...list.map(field => columns.find(v => v.field === field)))
      this.getCheckedOptions(checkedOptions)
      // this.indeterminate = !!listLength && listLength < columns.length
      // this.checkAll = listLength === columns.length
    },
    // 分组单选
    onChangeByGroup(list, item) {
      const options = item.children
      const columns = this.flatColumns
      const checkedOptions = this.checkedOptions
      const listLength = list.length
      const curCheckedOptions = this.checkedOptions.filter(v => options.some(_v => _v.field === v.field))
      // 删除 已被取消的项目
      curCheckedOptions.map(v => {
        const _index = list.findIndex(field => v.field === field)
        // 如果当前项目在 新的 curCheckedOptions 找不到 进行删除
        if (_index === -1) {
          const checkedOptions_index = checkedOptions.findIndex(_v => _v.field === v.field)
          checkedOptions_index > -1 && checkedOptions.splice(checkedOptions_index, 1)
        } else {
          // 找的到相同的 就把该项目删除 减少下次遍历的次数
          list.splice(_index, 1)
        }
      })
      checkedOptions.push(...list.map(field => columns.find(v => v.field === field)))
      this.getCheckedOptions(checkedOptions)
      item.indeterminate = !!listLength && listLength < options.length
      item.checkAll = listLength === options.length
    },
    // 分组全选
    onCheckAllChangeByGroup(e, item) {
      const options = item.children || []
      const bool = e.target.checked
      const checkedOptions = this.checkedOptions
      let fixedNum = 0
      if (bool) {
        // 将原来不存在的配置项按照默认的排序进行添加
        options.map(v => {
          if (checkedOptions.every(_v => _v.field !== v.field)) {
            checkedOptions.push(v)
          }
        })
      } else {
        options.map(v => {
          const _index = checkedOptions.findIndex(_v => {
            if (_v.field === v.field) {
              // 如果找到对应的数据 但 标记为固定的 不进行删除 标记 index
              if (!_v.fixed) {
                return true
              } else {
                fixedNum++
              }
            }
            return false
          })
          if (_index > -1) {
            checkedOptions.splice(_index, 1)
          }
        })
      }
      // console.log(e, options, 'test ......', bool)
      this.getCheckedOptions(checkedOptions)
      item.indeterminate = fixedNum > 0
      item.checkAll = bool
    },
    topAction(e) {
      const actionName = e.target.value
      // { label: '全选', value: 'onCheckAllChange' },
      // { label: '取消选择', value: 'onCheckClearAllChange' },
      // { label: '反选', value: 'onCheckReverseChange' },
      this[actionName]()
    },
    // 全选功能
    onCheckAllChange(e) {
      const columns = this.flatColumns
      // 标记fixed的项目 表示始终保留
      const checkedOptions = JSON.parse(JSON.stringify(columns.filter(v => v.fixed)))
      // const bool = e.target.checked
      // if (bool) {
      // 将原来不存在的配置项按照默认的排序进行添加
      columns.map(v => {
        if (checkedOptions.every(_v => _v.field !== v.field)) {
          checkedOptions.push(v)
        }
      })
      // }
      this.getCheckedOptions(checkedOptions)
      // Object.assign(this, {
      //   indeterminate: bool ? false : checkedOptions.length > 0,
      //   checkAll: bool
      // })
      this.checkAllCheckAllByGroup()
    },
    // 全部取消
    onCheckClearAllChange(e) {
      const columns = this.flatColumns
      const checkedOptions = columns.filter(v => v.fixed)
      const checkedLength = checkedOptions.length
      this.getCheckedOptions(checkedOptions)
      // const bool = e.target.checked
      Object.assign(this, {
        // indeterminate: !!checkedLength && checkedLength < columns.length,
        // checkClearAll: true,
        // checkReverse: false,
        checkAll: checkedLength === columns.length
      })
      // 分组 选中值 更新
      this.checkAllCheckAllByGroup()
    },
    // 反选 （不做原有排序保存）
    onCheckReverseChange(e) {
      const columns = this.flatColumns
      // console.log(JSON.stringify(columns), 'columns options')
      // const bool = e.target.checked
      const checkedOptions = columns.filter(v => v.fixed || this.checkedOptions.every(item => v.field !== item.field))
      const checkedLength = checkedOptions.length
      this.getCheckedOptions(checkedOptions)
      Object.assign(this, {
        // indeterminate: !!checkedLength && checkedLength < columns.length,
        // checkReverse: bool,
        checkAll: checkedLength === columns.length
      })
      this.checkAllCheckAllByGroup()
    },
    // 重置columns 配置 (走 系统配置默认选中)
    resetDefault() {
      let _defaultCheckedOptions = this.flatColumns
      if (Array.isArray(this.defaultCheckedOptions)) {
        _defaultCheckedOptions = this.defaultCheckedOptions
      }
      this.getCheckedOptions(_defaultCheckedOptions)
      const columns = this.flatColumns
      const checkedLength = _defaultCheckedOptions.length

      Object.assign(this, {
        // checkReverse: false,
        // indeterminate: !!checkedLength && checkedLength < columns.length,
        checkAll: checkedLength === columns.length
      })
      this.checkAllCheckAllByGroup()
    },
    // 针对全选 反选 初始化 进行选取按按钮状态更新
    checkAllCheckAllByGroup() {
      // 如果是 分组类型配置列表
      if (this.isChildrenType) {
        this.columns.map(v => {
          const options = v.children
          // const flagDisabled = options.some(v => v.fixed)
          const curCheckedList = this.checkedOptions.filter(v => options.some(_v => _v.field === v.field))
          if (curCheckedList.length >= options.length) {
            v.indeterminate = false
            v.checkAll = true
          } else {
            v.indeterminate = !!curCheckedList.length
            v.checkAll = false
          }
        })
      }
    },
    submitHandler() {
      const options = this.checkedOptions
      if (Array.isArray(options) && !options.length) return this.$message.warn('请至少选中一个选项~')
      this.$emit('input', options)
      this.closeDialog()
      // this.submit(this)
    }
  }
}
</script>
