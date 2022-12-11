<template>
  <div class="flex-column-page-wrap pageWrap">
    Others[存放 不默认引入的组件集合 && 其他 特殊相关]
    <!--  以下是默认不应用全局的组件  -->
    <div class="common_title">todo</div>
    <div class="content">
      <ExtraDemo class='local_extraDemo'></ExtraDemo>
      ....
    </div>
  </div>
</template>

<script>
// import ExtraDemo from 'xiaopubao-ui/packages/xxx'
import { ExtraDemo } from 'xiaopubao-ui/packages/extra_load'
// import ExtraComponents from 'xiaopubao-ui/packages/extra_load'
// console.error(ExtraComponents)
export default {
  name: 'others',
  components: {
    ExtraDemo
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.pageWrap {
  padding: 10px 12px;
  overflow: auto;
}
.local_extraDemo {
  background: #bd9393;
  padding: 10px 0;
}

</style>
