/** 
 * 入口脚本
 * 
 * @Author: Cphayim 
 * @Date: 2017-10-17 16:13:12 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-26 00:48:21
 */

// 全局样式 (有覆盖关系，顺序不要乱)
import '@/styles/reset.scss' // 1
import 'mint-ui/lib/style.css' // 2
import '@/styles/coverage.scss' // 3

/**
 * 预处理脚本
 */
import Response from './scripts/response'
// import FastClick from 'fastclick'

/**
 * Vue 相关
 */
import Vue from 'vue'
import MintUI from 'mint-ui'
import router from './router'
// import axios from 'axios'
import axios from './scripts/request'
import App from '@/App'

// document.addEventListener('DOMContentLoaded', () => { FastClick.attach(document.body) })

Vue.use(MintUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
