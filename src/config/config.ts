/*
 * 全局配置项
 * @Author: Cphayim 
 * @Date: 2017-09-11 00:25:54 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-20 15:19:57
 */

// 小程序 appid
export const AppId = 'wx1e351c277e5f118b'
// 版本号 
export const AppVersion = '0.8'

// HTTP 请求域名
export let domain = 'https://ssl.api.vcar360.com'

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
export const Roles = ((roles) => {
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

// 下拉刷新延迟时间
export let refreshDelay = 600

// 默认页面加载列表项数
export let defuatPageSize = 20

// 最大页面加载列表项数
export let maxPageSize = 999