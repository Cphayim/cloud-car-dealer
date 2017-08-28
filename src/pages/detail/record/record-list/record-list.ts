/*
 * 待建档客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 02:19:42 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 17:40:41
 */

import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck } from '../../../../modules/auth';
import { listTimeFormat } from '../../../../modules/util';

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

    private onLoad(options) {
        this.loadData();
    }

    private loadData() {
        this.requestData()
            .then((res: any) => {
                if (resCodeCheck(res)) return;

                this.data.clientTotal = res.total;
                this.data.clientList = res.data;

                this.data.clientList.forEach(item => {
                    item.time = listTimeFormat(item.SubscribeTime);
                })

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
}

Page(new RecordListPage());