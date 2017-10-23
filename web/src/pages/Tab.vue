<style lang="scss" scoped>
@import '../styles/style-config.scss';
.container {
  width: 100%;
  // height: 100%;
  padding-top: 40px;
  background-color: $color_back;
  &.hastab{
    padding-bottom: 50px;
  }
}
</style>

<template>
  <div class="container hastab">
    <!-- Tab 页内容区 -->
    <div class="wraper">
      <!-- 子路由 -->
      <router-view></router-view>
      <!-- /子路由 -->
    </div>
    <!-- /Tab 页内容区 -->
    <!-- Tab 栏 -->
    <tab-bar></tab-bar>
    <!-- /Tab 栏 -->
  </div>
</template>

<script>
import TabBar from '@/components/business/TabBar'
import HomePage from '@/pages/Tabs/Home'

export default {
  name: 'TabPage',
  components: { TabBar, HomePage },

  data() {
    return {
      activeTab: 'home'
    }
  },
  methods:{
    changeTab(name){
      this.activeTab = name
    }
  }

}
</script>
