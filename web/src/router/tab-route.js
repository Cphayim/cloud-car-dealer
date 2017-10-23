/*
 * Tab 路由 及 Tab 二级路由配置
 * @Author: Cphayim 
 * @Date: 2017-10-17 15:07:47 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-18 09:08:06
 */
import TabPage from '@/pages/Tab'
import HomePage from '@/pages/Tabs/Home'
import BusinessPage from '@/pages/Tabs/Business'
import ClientPage from '@/pages/Tabs/Client'
import MessagePage from '@/pages/Tabs/Message'
import MePage from '@/pages/Tabs/Me'

export default {
  path: '/tab',
  name: 'tab',
  /* 映射组件 */
  component: TabPage,
  /* 默认进入 home 二级路由 */
  redirect: '/tab/home',
  children: [
    { // 首页
      path: 'home',
      name: 'home',
      component: HomePage
    },
    { // 业务
      path: 'business',
      name: 'business',
      component: BusinessPage,
      beforeEnter: (to, from, next) => {
        console.log('to')
        console.log(to)
        console.log('from')
        console.log(from)
        next()
      }
    },
    { // 客户
      path: 'client',
      name: 'client',
      component: ClientPage,
      beforeEnter: (to, from, next) => {
        console.log('to')
        console.log(to)
        console.log('from')
        console.log(from)
        next()
      }
    },
    { // 对话
      path: 'message',
      name: 'message',
      component: MessagePage,
      beforeEnter: (to, from, next) => {
        console.log('to')
        console.log(to)
        console.log('from')
        console.log(from)
        next()
      }
    },
    { // 我
      path: 'me',
      name: 'me',
      component: MePage,
      beforeEnter: (to, from, next) => {
        console.log('to')
        console.log(to)
        console.log('from')
        console.log(from)
        next()
      }
    }
  ]
}