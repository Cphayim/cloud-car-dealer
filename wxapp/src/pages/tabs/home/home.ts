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
 * @Last Modified time: 2017-09-19 11:25:08
 */

class HomePage extends BasePage {
    constructor() {
        super();
    }
    public data = {
        loaded: false,
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
                this.setData({
                    loaded: false
                })
                // console.log(res.data);
                // 检查是否请求失败
                if (resCodeCheck(res)) return;

                const delay = isRefresh ? refreshDelay : 100;
                // 请求成功，渲染视图
                setTimeout(() => {
                    this.setData({
                        loaded: true,
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
                const result: string = res.result;
                console.log('result: ' + result);

                // 扣款码正则
                const reg: RegExp = /^.*?rand=(.*)&?.*$/;
                const matchResult = result.match(reg);

                // 是扣款码直接跳转到扣款页
                if (matchResult) {
                    const rand: string = matchResult[1];
                    wx.navigateTo({
                        url: pagePath.charge + '?rand=' + rand
                    });
                } else {
                    toast.showLoading();
                    // 发给服务器验证二维码有效性
                    request({
                        url: domain + '/Biz/QRcodeItem/ScanCode',
                        data: {
                            no: result
                        }
                    }).then((res: any) => {
                        if (resCodeCheck(res)) { return }
                        toast.hide();
                        const { url } = res.data;
                        console.log('url: ' + url);
                        // 判断 result 是否是业务链接 / Biz / OpportunityPre / Detail ? Id = 98588
                        if (/OpportunityPre/.test(url)) {
                            console.log('报名');
                            const id = url.match(/.*Id=(\d+)&?/i)[1];
                            wx.navigateTo({
                                url: pagePath.opportunity + '?id=' + id
                            });
                        }
                        // 判断 result 是否是优惠券链接 /Biz/CardRecord/DetailForUse?id=67612
                        else if (/CardRecord/.test(url)) {
                            console.log('优惠券');
                            const id = url.match(/.*Id=(\d+)&?/i)[1];
                        }
                    })
                    // toast.showWarning('非平台二维码');
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
        wx.pageScrollTo({
            scrollTop: 0
        })
    }
    private onReachBottom() { }
    private onShareAppMessage() { }
}

Page(new HomePage());