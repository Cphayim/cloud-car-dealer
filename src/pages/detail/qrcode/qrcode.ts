/*
 * 顾问二维码页面
 * @Author: 云程科技
 * @Date: 2017-08-24 19:28:13 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 17:19:59
 */

import BasePage from '../../basepage';
import { request } from '../../../modules/request';
import { domain } from '../../../config/url.config';
import { resCodeCheck } from '../../../modules/auth';
import toast from '../../../modules/toast';
import { listTimeFormat } from '../../../modules/util';
import { refreshDelay } from '../../../config/config';
import pagePath from '../../../config/path.config';

interface Data {
    loaded: boolean;
    qrCodeImage: string;
    scanList: any[];
}

class QRCodePage extends BasePage {
    private reqData = {
        ticket: ''
    }
    public data: Data = {
        loaded: false,
        qrCodeImage: '',
        scanList: []
    }
    private onLoad(options) {
        this.loadData();
    }

    /**
     * 加载数据
     */
    private loadData(isRefresh = false) {
        toast.showLoading('正在加载...');
        this.requestData()
            .then((res: any) => {
                if (resCodeCheck(res)) return;
                this.data.qrCodeImage = res.data.qrCode.Image;
                this.data.scanList = res.data.codeList;
                this.data.scanList.forEach(item => {
                    item.time = item.CreateTime.replace(/\//g, '-');
                });

                toast.hide();
                if (isRefresh) {
                    setTimeout(() => {
                        this.setData({
                            qrCodeImage: this.data.qrCodeImage,
                            scanList: this.data.scanList,
                            loaded: true
                        });
                        toast.showSuccess('刷新成功');
                        wx.stopPullDownRefresh();
                    }, refreshDelay);
                } else {
                    this.setData({
                        qrCodeImage: this.data.qrCodeImage,
                        scanList: this.data.scanList,
                        loaded: true
                    });
                }
            });
    }
    /**
     * 请求数据
     */
    private requestData() {
        this.reqData.ticket = wx.getStorageSync('ticket');
        return request({
            url: `${domain}/ApiQRCode/ReadForQRCode`,
            data: this.reqData
        });
    }

    private toDetail(e) {
        let { id, linkType } = e.currentTarget.dataset;
        // 如果 linkType == 0 说明已绑定其他顾问
        if (!linkType) return;

        let url = '';
        // 还未建档
        if (linkType == 1) {
            // 跳转到 待建档建档 线索详情
            url = `${pagePath['record-edit']}?id=${id}`;
        }
        // 已建档
        else if (linkType == 2) {
            // 跳转到 客户详情
            url = `${pagePath['customer']}?id=${id}`;
        } else {
            return;
        }
        wx.navigateTo({
            url: url
        });
    }

    private onPullDownRefresh(e) {
        // 下拉刷新
        this.loadData(true);
    }
}

Page(new QRCodePage());