import Vue from 'vue'
import Router from 'vue-router'

// 登录页 
import LoginPage from '@/pages/Login'

// tab 相关路由配置
import tabRoute from '@/router/tab-route'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/tab/home'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    tabRoute,
    // 404
    {
      path: '*', component: {
        template: '<div>404 Not found</div>'
      }
    }
  ]
})
