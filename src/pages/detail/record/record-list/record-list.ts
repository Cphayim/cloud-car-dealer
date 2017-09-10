/*
 * 待建档客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 02:19:42 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:25:23
 */

import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth';
import { listTimeFormat } from '../../../../modules/util';
import toast from '../../../../modules/toast';

interface Data {
    loaded: boolean;
    clientTotal: number;
    clientList: any[];
}
class RecordListPage extends BasePage {
    private reqData = {
        ticket: '',
        PageSize: 500,
        PageNo: 1
    }
    public data: Data = {
        loaded: false,
        clientTotal: 0,
        clientList: []
    }

    // 跳转控制属性
    // 跳转到 customer 值为 customerId，由子页面传递
    public goToCustomer: number = 0;

    private onLoad(options) {
        this.loadData();
    }

    private loadData() {
        toast.showLoading();
        this.requestData()
            .then((res: any) => {
                if (resCodeCheck(res)) return;

                this.data.clientTotal = res.total;
                this.data.clientList = res.data;

                this.data.clientList.forEach(item => {
                    item.time = listTimeFormat(item.SubscribeTime);
                })
                toast.hide();
                this.setData({
                    clientList: this.data.clientList,
                    clientTotal: this.data.clientTotal,
                    loaded: true
                });
            });
    }

    private requestData() {
        this.reqData.ticket = wx.getStorageSync('ticket');
        return request({
            url: `${domain}/ApiCustomerPre/ReadForRecord`,
            data: this.reqData
        });
    }

    /**
     * 进入 record-info 待建档客户 线索详情
     * @param e 
     */
    private itemToEnter(e) {
        const id: string = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `${pagePath['record-info']}?id=${id}`
        });
    }

    public onShow() {
        this.loadData();
        // console.log(this.goToCustomer);
        // 如果有跳转值跳转到 customer
        if (this.goToCustomer) {
            const id = this.goToCustomer;
            this.goToCustomer = 0;
            setTimeout(() => {
                wx.navigateTo({
                    url: `${pagePath.customer}?id=${id}`
                });
            }, 400);
        }
    }
}

Page(new RecordListPage());