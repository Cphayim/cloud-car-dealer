<style lang="scss" scoped>
@import '../styles/style-config.scss';
.container {
  // overflow: scroll;
  // position: absolute;
  width: 100%; // height: 100%;
  padding-top: 40px;
  background-color: $color_back;
  &.hastab {
    padding-bottom: 50px;
  }
}
</style>

<template>
  <div class="container hastab">
    <!-- 导航栏 -->
    <mt-header fixed :title="title">
      <header-bar-plus-btn slot="right"></header-bar-plus-btn>
      </mt-button>
    </mt-header>
    <!-- /导航栏 -->
    <!-- Tab 页内容区 -->
    <div class="wraper">
      <keep-alive>
        <!-- 子路由 -->
        <router-view @changeTitle="changeTitle"></router-view>
        <!-- /子路由 -->
      </keep-alive>
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
import HeaderBarPlusBtn from '@/components/business/HeaderBarPlusBtn'

export default {
  name: 'TabPage',
  components: { TabBar, HomePage, HeaderBarPlusBtn },

  data() {
    return {
      activeTab: 'home',
      title: '商家助手'
    }
  },
  methods: {
    changeTab(name) {
      this.activeTab = name
    },
    changeTitle(title) {
      this.title = title
    }
  }

}
</script>
