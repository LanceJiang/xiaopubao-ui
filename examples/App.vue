<template>
  <a-locale-provider :locale="locale">
    <div id="app" class="page-wrapper">
      <div class="page-select">
        选择页面：
        <a-select :value="routeName" placeholder="请选择页面" @change="switchRoute">
          <a-select-opt-group
            v-for="group in $router.options.routes"
            :key="group.name"
            :label="group.name">
            <a-select-option
              v-for="item in group.children"
              :key="group.name+item.name"
              :value="item.name">
              {{item.name}}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </div>
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      locale: zhCN,
      routeName: undefined // 'home-Default'
    }
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler (value) {
        this.routeName = value
      }
    }
  },
  /* watch: {
    routeName: {
      // immediate: true,
      handler(name) {
        if (name !== this.$route.name) {
          this.$router.push({ name })
        }
      }
    }
  }, */
  created() {
    // this.switchRoute(this.$route.name)
    window.test = this
  },
  methods: {
    switchRoute(routeName) {
      // this.routeName = routeName
      this.$router.push({ name: routeName })
    }
  }
}
</script>
<style lang="less">
html,body {
  height: 100%;
}
.page-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: auto;
}
#app {
  //font-family: @x-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  height: 100%;
  //color: #2c3e50;
}
// 详情划分标题
.common_title {
  position: relative;
  display: flex;
  align-items: center;
  //line-height: 22px;
  padding: 12px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  &:before {
    content: '';
    width: 3px;
    height: 16px;
    margin-right: 6px;
    background: @xpb-color-primary;
  }
}
.page-select {
  text-align: center;
  padding: 6px 0;
  background: @xpb_testColor;
}
</style>
