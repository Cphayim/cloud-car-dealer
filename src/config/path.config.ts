/*
 * 页面路径配置
 * @Author: 云程科技 
 * @Date: 2017-06-28 16:56:25 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-13 20:25:00
 */
// 页面基本路径
const baseUrl = '/pages';

// 路径数组
const pathArr: any[] = [
  /**
   * 独立页
   */
  {
    name: 'welcome', // 启动兼登录页
    pre: ''
  },
  {
    name: 'search', // 搜索
    pre: ''
  },
  /**
   * tab 页
   */
  {
    name: 'home', // 首页
    pre: 'tabs'
  },
  {
    name: 'business', // 业务
    pre: 'tabs'
  },
  {
    name: 'client', // 客户
    pre: 'tabs'
  },
  {
    name: 'message', // 对话
    pre: 'tabs'
  },
  {
    name: 'me', //我
    pre: 'tabs'
  },

  /**
   * 二级页
   */
  {
    name: 'dialogue', // 聊天界面
    pre: 'detail'
  },
  // 扩展
  {
    name: 'extend', // 聊天界面-扩展工具
    pre: 'detail/dialogue'
  },
  {
    name: 'remind', // 聊天界面-提醒
    pre: 'detail/dialogue'
  },
  {
    name: 'opportunity',// 业务详情
    pre: 'detail'
  },
  {
    name: 'customer',// 客户详情
    pre: 'detail'
  },
  {
    name: 'customer-edit', // 客户详情编辑
    pre: 'detail/customer'
  },
  {
    name: 'task', // 任务
    pr: 'detail'
  }
];

// 生成路径对象
const pagePath:any = {};
for (let obj of pathArr) {
  let pre = !!obj.pre ? `/${obj.pre}` : ``;
  let page = `/${obj.name}`;
  pagePath[obj.name] = `${baseUrl}${pre}${page + page}`;
}

// 导出配置
export default pagePath