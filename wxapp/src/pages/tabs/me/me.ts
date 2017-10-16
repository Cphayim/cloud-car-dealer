import BasePage from '../../basepage';
import { Roles } from '../../../config/config';
import { modal } from '../../../modules/modal';
import pagePath from '../../../config/path.config';
/*
 * Tab 我 逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 17:23:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-18 13:58:00
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
    public data = {
        employeeInfo: {},
        workList
    }
    private onLoad(options) {
        const employeeInfo = wx.getStorageSync('employee');
        console.log(employeeInfo);
        this.data.employeeInfo = {
            id: employeeInfo.Id,
            avatar: employeeInfo.Image,
            name: employeeInfo.Name || employeeInfo.Nickname,
            role: Roles[employeeInfo.Role]
        }
        this.setData({
            employeeInfo: this.data.employeeInfo
        });
    }
    public logout(e) {
        modal.show({
            title: '',
            content: '确定退出登录吗？'
        }).then(flag => {
            if (flag) {
                // 清除用户缓存数据
                wx.removeStorageSync('ticket');
                wx.removeStorageSync('employee');
                wx.removeStorageSync('tenant');
                // 返回登录页
                wx.redirectTo({
                    url: pagePath.welcome
                })
            }
        })
    }
}

Page(new MePage());