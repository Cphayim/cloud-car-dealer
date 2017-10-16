<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>

<template>
  <index-tab></index-tab>
  <!-- <client-tab></client-tab> -->
</template>

<script>
import IndexTab from '@/pages/IndexTab'
import ClientTab from '@/pages/ClientTab'
export default {
  name: 'App',
  components:{
    IndexTab,
    ClientTab
  }
}
</script>

