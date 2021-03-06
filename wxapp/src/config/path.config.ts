/*
 * 页面路径配置
 * @Author: 云程科技 
 * @Date: 2017-06-28 16:56:25 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:20:37
 */

interface Path {
    name: string, // 页面名称
    pre: string // 前置路径
}

// 页面基本路径
const baseUrl = '/pages';

// 路径数组
const pathArr: Path[] = [
    /**
     * 独立页
     */
    { name: 'welcome', pre: '' },
    { name: 'search', pre: '' },


    /**
     * Tab 首页 及 相关子页
     */
    // Tab 首页
    { name: 'home', pre: 'tabs' },
    // 月度统计
    { name: 'monthly', pre: 'detail' },
    // 活跃客户
    { name: 'active-list', pre: 'detail/active-client' }, // 活跃客户列表
    { name: 'active-info', pre: 'detail/active-client' }, // 活跃客户轨迹
    // 任务
    { name: 'task', pre: 'detail' },
    // 扣款信息
    { name: 'charge', pre: 'detail' },
    // 二维码
    { name: 'qrcode', pre: 'detail' },
    // 待建档
    { name: 'record-list', pre: 'detail/record' }, // 建档列表
    { name: 'record-info', pre: 'detail/record' }, // 建档信息
    { name: 'record-edit', pre: 'detail/record' }, // 建档编辑


    /**
     * Tab 业务 及 相关子页
     */
    // Tab 业务
    { name: 'business', pre: 'tabs' },
    // 业务详情
    { name: 'opportunity', pre: 'detail' },


    /**
     * Tab 客户 及 相关子页
     */
    // Tab 客户
    { name: 'client', pre: 'tabs' },
    // 客户详情
    { name: 'customer-info', pre: 'detail/customer' }, // 信息
    { name: 'customer-edit', pre: 'detail/customer' }, // 编辑
    { name: 'customer-order', pre: 'detail/customer' }, // 订单信息
    { name: 'customer-deal', pre: 'detail/customer' }, // 成交信息
    { name: 'customer-lose', pre: 'detail/customer' }, // 流失登记(三合一)
    { name: 'customer-discuss', pre: 'detail/customer' }, // 跟进信息 / 备注


    /**
     * Tab 对话 及 相关子页
     */
    // Tab 对话
    { name: 'message', pre: 'tabs' },
    // 聊天界面
    { name: 'chat', pre: 'detail/chat' }, // 聊天界面
    { name: 'chat-extend', pre: 'detail/chat' },// 聊天界面-扩展工具
    { name: 'chat-remind', pre: 'detail/chat' },// 聊天界面-提醒


    /**
     * Tab 我 及 相关子页
     */
    // Tab 我
    { name: 'me', pre: 'tabs' }
];

// 生成路径对象
const pagePath: any = {};
for (let obj of pathArr) {
    let pre = !!obj.pre ? `/${obj.pre}` : ``;
    let page = `/${obj.name}`;
    pagePath[obj.name] = `${baseUrl}${pre}${page + page}`;
}

// 导出配置
export default pagePath