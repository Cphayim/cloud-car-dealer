import BasePage from '../../../basepage';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth';
import toast from '../../../../modules/toast';
import { modal } from '../../../../modules/modal';
/*
 * 聊天界面-提醒逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-18 10:26:26 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 13:01:12
 */

class ChatRemindPage extends BasePage {
    private id: number = 0;
    public data = {
        loaded: false,
        employeeList: [],
        activeIndex: -1,
        activeEmployeeId: ''
    }
    private onLoad(options) {
        this.id = ~~options.id;
        this.loadData();
    }
    private loadData() {
        toast.showLoading();
        request({
            url: domain + '/WX/Message/ForwardReminder',
            data: {
                customerId: this.id
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            this.setData({
                loaded: true,
                employeeList: res.data
            });
            toast.hide();
        })
    }
    public chooseEmployee(e) {
        const { employeeId, index } = e.currentTarget.dataset;
        this.setData({
            activeIndex: ~~index,
            activeEmployeeId: employeeId
        })
    }
    public save() {
        if (!this.data.activeEmployeeId) {
            return toast.showWarning('必须选择一个员工');
        }
        toast.showLoading();
        request({
            url: domain + '/WX/Message/Reminder',
            data: {
                employeeId: this.data.activeEmployeeId,
                customerId: this.id
            }
        }).then(res => {
            if (resCodeCheck(res)) { return }
            toast.hide();
            modal.show({
                title: '',
                content: '已发送提醒',
                showCancel: false
            }).then(flag => {
                wx.navigateBack();
            })
        })
    }
}
Page(new ChatRemindPage());