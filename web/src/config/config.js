/*
 * 全局配置项
 * 
 * @Author: Cphayim 
 * @Date: 2017-10-19 14:14:06 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-26 18:16:22
 */


export default {
  // 应用名称
  APP_NAME: 'YCS-sjzs for web',
  // 应用版本号
  APP_VERSION: 'v2.0.1',

  // 请求主机名
  // HOST: 'http://app.vcar360.com', // 线上服务器
  // HOST: 'http://127.0.0.1:3000', // 本地模拟数据服务器
  // HOST: 'http://192.168.10.110:3000',
  HOST: '', // 测试服务器

  // 下拉刷新延迟时间（毫秒）
  REFRESH_DELAY: 600,

  // 默认页面单次请求加载列表项数
  DEFUALT_PAGE_SIZE: 20,
  // 最大页面单次请求加载列表项数
  MAX_PAGE_SIZE: 999,

  // 角色枚举
  ROLES: (() => {
    // 角色对象
    const roles = {
      'WX_Sales': '销售顾问',
      'WX_Service': '售后顾问',
      'WX_SalesSupervisor': '销售主管',
      'WX_ServiceSupervisor': '售后主管',
      'WX_SalesManager': '销售经理',
      'WX_ServiceManager': '售后经理',
      'WX_GeneralManager': '总经理',
      'WX_Admin': '店铺管理员',
      'WX_Rescuer': '救援专员',
      'WX_Insurer': '保险专员',
      'WX_Claim': '理赔专员',
      'WX_Finance': '财务专员'
    }
    const enumRoles = {}
    const keys = Object.keys(roles)
    // 角色对象 -> 角色枚举
    keys.forEach(item => {
      // 键 -> 值
      enumRoles[item] = roles[item]
      // 值 -> 键
      enumRoles[roles[item]] = item
    })
    return enumRoles
  })()

}