<template>
  <a-popover
    :trigger="['click']"
    :visible="comp_visible"
    @visibleChange="visibleChange"
    :getPopupContainer="getPopupContainer"
    overlayClassName='customColumnPopover'
    :placement="placement">
    <slot><a-button>自定义列</a-button></slot>
    <template slot="content">
      <a-spin :spinning="loading">
        <!-- 自定义Modal 标题 -->
        <header class="header">
          <slot name="title">{{title}}</slot>
        </header>
        <div :class="{ _contentWrap: true, '_contentWrap-sort': sortable}">
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
                      {{ option.t_label ? t(option.t_label) : option.label }}
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
                {{ v.t_label ? t(v.t_label) : v.label }}
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
// import { editModuleListConfigObj, getModuleListConfigObj } from '@/services/Common'
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
          const _label = v.t_label ? t(v.t_label) : v.label
          return <div
            class="list-group-item"
            key={v.field}
          >
            <div class={['itemWrap', `${v.fixed ? 'disabled' : ''}`]}>
              <span class="xpb-iconfont xpb-drag-el dragEl"/>
              <span class="label_txt" title={_label}>{ _label }</span>
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
       * { label: column的标题【String】,
       *   field: column的field【String】(value),
       *   fixed: 控制column是否固定fixed【Boolean】 (disabled),
       *   _fixed: 标记column是否有置顶置底置换功能【left/right】,
       *   dynamic: 标记column是否根据本地的column进行label替换【Boolean】}
       * ]
       */
    },
    value: {
      // 类 columns 配置
      type: Array
      // default: () => []
      // todo dynamic: 标记column是否根据本地的column进行label替换【Boolean】
      /* type Options = { t_label: string; label: string; field: string; fixed: boolean|string }[] */
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
            v.label = (this.flatColumns.find(_v => v.field === _v.field) || {}).label || v.label
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
              v.label = (this.flatColumns.find(_v => v.field === _v.field) || {}).label || v.label
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

<style lang='less'>
.customColumnPopover {
  .ant-popover-inner-content {
    width: 750px;
    padding: 0;
  }
}
</style>
<style lang='less' scoped>
.customColumnPopover {
  z-index: 9999;
  ._contentWrap {
    position: relative;
    padding-bottom: 10px;
    min-height: 300px;
    transition: all 20ms ease-in;
    .header {
      height: 40px;
      border-top: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
      background: #f6f6f6;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
    }
    .leftBox {
      padding: 0 16px;
      min-height: 240px;
      max-height: 70vh;
      overflow-y: auto;
    }
    &._contentWrap-sort {
      padding-right: 182px;
    }
    .rightBox {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      width: 182px;
      height: 100%;
      border-left: 1px solid #e9e9e9;
      &::v-deep {
        //.flip-list {
        //  transition: all 0.3s ease-in-out;
        //}
        //.flip-list-move {
        //  transition: transform 0.3s;
        //}
        .no-move {
          transition: transform 0s;
        }
        // 拖动时候的样式
        .ghost {
          //opacity: 0.5;
          //background: rgba(87, 129, 244, .2);
          //box-shadow: 1px 1px 5px 2px rgb(0 0 0 / 15%);
          //cursor: move;
          //box-shadow: #007bfc 0 0 6px -2px inset;
          //background: #f00;
          box-shadow: 1px 1px 5px 2px rgba(0,0,0,.15);
          cursor: move;
          transition: .18s ease;
        }
        .chosen {
          box-shadow: 1px 1px 5px 2px rgba(0,0,0,.15);
        }
        .list-group {
          padding-left: 8px;
          //padding-right: 16px;
          flex: 1;
          width: 100%;
          overflow-y: auto;
          .list-group-item {
            .itemWrap {
              display: flex;
              align-items: center;
              line-height: 28px;
              padding-right: 4px;
              color: #333;
              font-size: 12px;
              cursor: pointer;
              transition: .18s ease;
              width: 100%;
              // 不能拖动 不能删除
              &.disabled {
                color: rgba(0, 0, 0, 0.25);
                cursor: not-allowed;
                &.ghost {
                  background: unset;
                }
                & > .dragEl {
                  cursor: not-allowed;
                }
                opacity: unset;
                box-shadow: none;
                .disabled_fixed {
                  width: 28px;
                  margin-left: auto;
                  cursor: pointer;
                  color: #007bfc;
                }
              }
              .dragEl {
                font-size: 16px;
                cursor: move;
                margin-right: 8px;
              }
              .label_txt{
                display: inline-block;
                flex: 1;
                //width: 80%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              & > .delEl {
                display: none;
                margin-left: auto;
              }
              &:not(.disabled):hover {
                color: #007bfc;
                & > .delEl {
                  display: inline-block;
                }
              }
            }
          }
        }
      }
      .list-group_empty {
        position: absolute;
        left: 0;
        top: 50px;
        width: 100%;
        padding-top: 20px;
        text-align: center;
      }
    }
  }
  .checkGroup {
    width: 100%;
    padding: 0;
    display: block;
    //flex-wrap: wrap;
    /deep/ .ant-checkbox-wrapper {
      color: rgba(0, 0, 0, 0.85);
      flex: 1;
      display: inline-flex;
      align-items: center;
      width: 32%;
      min-width: 32%;
      max-width: 32%;
      margin-left: 0;
      margin-right: 8px;
      padding-top: 8px;
      &:nth-child(3n + 3) {
        margin-right: 0;
      }
      span:nth-of-type(2){
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        transform: translateY(-1px);
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 50px;
    font-size: 16px;
    color: #000;
  }
  .boxWrap {
    padding-top: 8px;
    &.no-padding{
      padding-top: 0;
    }
    .title {
      padding: 8px 0;
      &_checkBox {
        //display: flex;
        //align-items: center;
        //justify-content: space-between;
        font-size: 12px;
        color: #000;
        font-weight: bold;
        ///deep/.ant-checkbox {
        //  top: 0;
        //}
      }
    }
  }
  .footer {
    padding: 8px 16px;
    border-top: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
  }
}
</style>
