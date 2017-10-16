// 全局样式
import '@/style/base/reset.scss'
import 'mint-ui/lib/style.css'

/**
 * 脚本和 Vue 组件
 */
import Vue from 'vue'
import MintUI from 'mint-ui'
import App from '@/App'
// import router from './router'

Vue.use(MintUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App }
})
