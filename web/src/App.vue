<style lang="scss">
@import './styles/style-config.scss';
html,
body {
  // overflow: hidden;
  height: 100%;
  margin: 0;
  background-color: $color_back;
}

#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif; // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
}
*{
  box-sizing: border-box;
}
</style>

<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: { }
}
</script>

