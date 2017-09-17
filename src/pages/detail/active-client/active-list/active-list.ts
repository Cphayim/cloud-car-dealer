/*
 * 活跃客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 01:58:05 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:25:07
 */

import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth';
import { listTimeFormat } from '../../../../modules/util';
import pagePath from '../../../../config/path.config';
import { refreshDelay } from '../../../../config/config';

interface Data {
    loaded: boolean;
    activeList: any[];
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
     * @param isRefresh 是否是下拉刷新
     */
    private loadData(isRefresh: boolean = false) {
        toast.showLoading();
        this.requestData()
            .then((res: any) => {
                // 错误状态检查
                if (resCodeCheck(res)) return;
                this.data.activeTotal = res.total;
                this.data.activeList = res.data;
                this.data.activeList.map(item => {
                    item.time = listTimeFormat(item.LastTrackTime);
                    return item;
                });

                const delay = isRefresh ? refreshDelay : 0;

                toast.hide();
                setTimeout(() => {
                    this.setData({
                        loaded: true,
                        activeList: this.data.activeList,
                        activeTotal: this.data.activeTotal
                    });
                    if(isRefresh){
                        wx.stopPullDownRefresh();
                        toast.showSuccess('刷新成功');
                    }
                }, delay)

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

    private itemToEnter(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: pagePath['customer-info'] + '?id=' + id
        });
    }
    private onPullDownRefresh() {
        this.loadData(true);
    }
}

Page(new ActiveListPage());