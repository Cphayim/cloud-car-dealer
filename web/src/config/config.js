
// 应用版本号
export const CONF_APP_VERSION = 'v0.0.1'

// 请求地址
export const CONF_DOMAIN = 'https://ssl.api.vcar360.com'

// 下拉刷新延迟时间（毫秒）
export const CONF_REFRESH_DELAY = 600

// 默认页面单次请求加载列表项数
export const CONF_DEFUALT_PAGE_SIZE = 20
// 最大页面单次请求加载列表项数
export const CONF_MAX_PAGE_SIZE = 999

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

// 角色对象 -> 角色枚举
export const CONF_ROLES = (roles => {
  const enumRoles = {};
  const keys = Object.keys(roles);
  keys.forEach(item => {
    // 键 -> 值
    enumRoles[item] = roles[item];
    // 值 -> 键
    enumRoles[roles[item]] = item;
  });
  return enumRoles;
})(roles)