import BasePage from '../../basepage';
import { request } from '../../../modules/request';
import { domain } from '../../../config/config';
import toast from '../../../modules/toast';
import { resCodeCheck } from '../../../modules/auth';
import pagePath from '../../../config/path.config';
import { refreshDelay } from '../../../config/config';
/*
 * Tab 首页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:11:47 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:25:05
 */

class HomePage extends BasePage {
    constructor() {
        super();
    }
    public data: any = {
        pagePath: pagePath,
        homeData: {}
    }
    /**
     * 请求数据
     * @private
     * @returns {Promise-request} 
     * @memberof HomePage
     */
    private requestData() {
        const ticket: string = wx.getStorageSync('ticket');
        return request({
            url: `${domain}/ApiStatistic/HomeData`,
            data: {
                ticket
            }
        })
    }
    /**
     * 加载数据
     * @private
     * @param {boolean} [isRefresh=false] 是否是下拉刷新
     * @memberof HomePage
     */
    private loadData(isRefresh = false) {
        toast.showLoading();
        this.requestData()
            .then((res: any) => {
                // console.log(res.data);
                // 检查是否请求失败
                if (resCodeCheck(res)) return;

                const delay = isRefresh ? refreshDelay : 0;
                // 请求成功，渲染视图
                setTimeout(() => {
                    this.setData({
                        homeData: res.data
                    });
                    if (isRefresh) {
                        toast.showSuccess('刷新成功');
                        wx.stopPullDownRefresh();
                    } else {
                        toast.hide();
                    }
                }, delay);


            });
    }
    /**
     * 打开相机扫码
     */
    private openScan() {
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                const result: string = res.result,
                    reg: RegExp = /^.*?rand=(.*)&?.*$/;

                const matchResult = result.match(reg);
                // 判断 扫描结果是否有效，有效则携带参数
                if (matchResult) {
                    const rand: string = matchResult[1];
                    wx.navigateTo({
                        url: pagePath.charge + '?rand=' + rand
                    });
                }
            },
            fail(err) {
                console.log(err);
            }
        });
    }
    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        this.loadData();
    }
    private onReady() { }
    private onShow() { }
    private onHide() { }
    private onUnload() { }
    private onPullDownRefresh() {
        this.loadData(true);
    }
    private onReachBottom() { }
    private onShareAppMessage() { }
}

Page(new HomePage());