import BasePage from '../../basepage';
/*
 * Tab 我 逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 17:23:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-13 23:59:28
 */

// 渲染测试数据 
const workList = [];
const itemObj = {
    client: '客户管理',
    wechat: '微信群发',
    watcher: '业务监控',
    active: '活跃客户',
    groupsend: '群发审批',
    preferential: '优惠券审批',
    batch: '批量分配',
    letter: '站内信',
    address: '通讯录',
    friend: '朋友圈营销',
    personalized: '个性化设置',
    help: '使用宝典',
    setting: '设置'
}

for (let key in itemObj) {
    let obj = {
        className: key,
        title: itemObj[key]
    }
    workList.push(obj);
}

class MePage extends BasePage {
    public data:any = {
        workList
    }
    constructor() {
        super();
    }
    /**
   * 页面的初始数据
   */

    /**
     * 生命周期
     */
    private onLoad(options) {

    }
    private onReady() {

    }
    private onShow() {

    }
    private onHide() {

    }
    private onUnload() {

    }
    private onPullDownRefresh() {

    }
    private onReachBottom() {

    }
    private onShareAppMessage() {

    }
}

Page(new MePage());