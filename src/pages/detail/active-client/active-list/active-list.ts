/*
 * 活跃客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 01:58:05 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 15:51:09
 */

import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck } from '../../../../modules/auth';
import { listTimeFormat } from '../../../../modules/util';

interface Data {
    loaded: boolean;
    activeList:any[];
    activeTotal: number;
}


class ActiveListPage extends BasePage {
    private reqData = {
        ticket: '',
        EmployeeId: '',
        Type: 'Pre',
        OrderBy: 'LastTrackTime desc',
        PageNo: 1,
        PageSize: 500
    }
    public data: Data = {
        loaded: false,
        activeList: [],
        activeTotal: 0
    }

    /**
     * 加载数据
     */
    private loadData() {
        toast.showLoading('正在加载...');
        this.requestData()
            .then((res: any) => {
                // 错误状态检查
                if (resCodeCheck(res)) return;
                console.log(res);
                this.data.activeTotal = res.total;
                this.data.activeList = res.data;
                this.data.activeList.map(item=>{
                    item.time = listTimeFormat(item.LastTrackTime);
                    return item;
                });

                toast.hide();
                this.setData({
                    loaded:true,
                    activeList: this.data.activeList,
                    activeTotal:this.data.activeTotal
                });

            });
    }
    /**
     * 请求数据
     */
    private requestData() {
        this.reqData.ticket = wx.getStorageSync('ticket');
        this.reqData.EmployeeId = wx.getStorageSync('employee').Id;
        return request({
            url: `${domain}/UC/Customer/ReadForActivePre`,
            data: this.reqData
        });
    }
    private onLoad(options) {
        this.loadData();
    }
}

Page(new ActiveListPage());