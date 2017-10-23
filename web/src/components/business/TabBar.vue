<style lang="scss" scoped>
@import '../../styles/style-config.scss';
.m-tabbar {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fff;
  /* 
    normal
  */
  .tab-item {
    flex: 1;
    padding: 3px;
    span {
      display: block;
    }
    .icon {
      width: 26px;
      height: 26px;
      @include image('../../assets/tab-icons/tab-home.png'); // 默认图
      margin: 0 auto;
    }
    .title {
      @include font($font_nano, $color_f3);
      text-align: center;
    }
    .home {
      background-image: url('../../assets/tab-icons/tab-home.png');
    }
    .business {
      background-image: url('../../assets/tab-icons/tab-business.png');
    }
    .client {
      background-image: url('../../assets/tab-icons/tab-client.png');
    }
    .message {
      background-image: url('../../assets/tab-icons/tab-message.png');
    }
    .me {
      background-image: url('../../assets/tab-icons/tab-me.png');
    }
  }
  /*
    active
  */
  .tab-item.router-link-active {
    .title {
      color: $color_main;
    }
    .home {
      background-image: url('../../assets/tab-icons/tab-home-active.png');
    }
    .business {
      background-image: url('../../assets/tab-icons/tab-business-active.png');
    }
    .client {
      background-image: url('../../assets/tab-icons/tab-client-active.png');
    }
    .message {
      background-image: url('../../assets/tab-icons/tab-message-active.png');
    }
    .me {
      background-image: url('../../assets/tab-icons/tab-me-active.png');
    }
  }
}
</style>

<template>
  <div class="m-tabbar">
    <router-link v-for="tabOption of tabOptions" :to="{name:tabOption.name}" :key="tabOption.name" @click="tabItemTap(tabOption.name)" class="tab-item" :class="{active:activeTab === tabOption.name}">
      <span class="icon" :class="tabOption.name"></span>
      <span class="title">{{tabOption.title}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tabbar',
  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      tabOptions: [{
        name: 'home',
        title: '首页'
      }, {
        name: 'business',
        title: '业务'
      }, {
        name: 'client',
        title: '客户'
      }, {
        name: 'message',
        title: '对话'
      }, {
        name: 'me',
        title: '我的'
      }]
    }
  },
  methods: {
    tabItemTap(name) {
      if (name === this.activeTab) { return }
      this.$emit('changeTab', name)
    }
  }
}
</script>
