/*
 * 聊天界面扩展工具逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-13 10:03:42 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 12:41:35
 */

import tempData from './tempdata'
import TabSlider from '../../../../components/tab-slider/tab-slider';
import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth';
import { modal } from '../../../../modules/modal';
import { dateFormat } from '../../../../modules/util';

const tabSlider = new TabSlider({});
class ChatExtendPage extends BasePage {
    private id: number = 0
    private tabSlider: TabSlider = tabSlider
    private cat: string = ''
    public data = {
        loaded: false,
        tabSlider
    }

    private onLoad(options) {
        // 修改导航栏标题
        wx.setNavigationBarTitle({
            title: decodeURI(options.nav)
        });
        this.id = ~~options.id;
        // 获取分类
        this.cat = options.cat;
        if (!this.cat) {
            toast.showError('参数错误');
            setTimeout(() => wx.navigateBack(), 2000);
            return;
        }

        // 根据 cat 参数调用各自的方法加载数据
        switch (this.cat) {
            case 'activity': // 店内活动
                this.loadActivity();
                break;
            case 'coupons': // 优惠券
                this.loadCoupons();
                break;
            case 'game': // 游戏
                this.loadGame();
                break;
            case 'position': // 商家位置
                this.loadPosition();
                break;
            case 'questionnaire': // 问卷调查
                break;
            case 'msgtpl': // 对话模板
                break;
            default:
                toast.showError('参数错误');
                return setTimeout(() => wx.navigateBack(), 2000);
        }
        // this.tabSlider.update(data);
    }


    /**
     * 加载店内活动列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadActivity() {
        toast.showLoading()
        // 活动分类字符串数组 ['News_Promo': 促销,'Shop_NewCar': 新车,'Shop_UsedCar': 二手车,'Shop_Product': 精品,'Shop_Service': 售后,'News_Article': 资讯]
        const catalogTitle: string[] = ['新车', '二手车', '精品', '售后', '资讯']
        const catalogKeysArr: string[] = ['Shop_NewCar', 'Shop_UsedCar', 'Shop_Product', 'Shop_Service', 'News_Article']
        /**
         * 获取店内活动的列表
         * @param catalogKeys 活动分类字符串
         */
        const getActivityData = (catalogKeys: string) => {
            return new Promise((resolve, reject) => {
                if (!catalogKeys) {
                    reject()
                    return
                }
                request({
                    url: domain + '/Car/Article/ReadForPicker',
                    data: {
                        catalogKeys,
                        pageNo: 1,
                        pageSize: 999
                    }
                }).then((res: any) => {
                    if (resCodeCheck(res)) {
                        reject()
                        return
                    }
                    resolve(res.data)
                })
            })
        }
        /**
         * 处理并发请求返回的列表集合，返回格式化之后的 TabSlider 组件更新数据
         * @param resList 
         */
        const getTabSliderFormatData = (resList: any[]) => {
            return resList.map((res, index) => {
                const tabSliderList: any = {}
                if (index === 0) {
                    tabSliderList.tabTitle = '全部'
                } else {
                    tabSliderList.tabTitle = catalogTitle[index - 1]
                }
                // 图文形式的列表
                tabSliderList.listType = 'graphic'
                tabSliderList.items = res.map(item => {
                    return {
                        id: item.Id,
                        image: item.TitleImage,
                        title: item.Title,
                        starttime: '',
                        endtime: item.EndTime,
                        catalogId: item.CatalogId,
                        url: item.WebUrl,
                        // 分类
                        catalog: 'activity'
                    }
                })
                return tabSliderList
            })
        }

        // 并发请求获取所有分类列表
        Promise.all([
            getActivityData(catalogKeysArr.join(',')),
            getActivityData(catalogKeysArr[0]),
            getActivityData(catalogKeysArr[1]),
            getActivityData(catalogKeysArr[2]),
            getActivityData(catalogKeysArr[3]),
            getActivityData(catalogKeysArr[4])
        ]).then((resList: any[]) => {
            // 获取将请求返回列表处理后的适用于 tabSlider 组件的数据
            const tabSliderData = getTabSliderFormatData(resList);
            // 更新组件
            this.tabSlider.update(tabSliderData)
            this.setData({ loaded: true })
            toast.hide()
        })
    }

    /**
     * 加载优惠券及优惠礼包列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadCoupons() {
        toast.showLoading()
        /**
         * 发送请求
         * 返回过滤错误状态后，携带响应数据的 Promise 实例
         */
        const reqP = (reqOpt) => {
            return new Promise((resolve, reject) => {
                request(reqOpt).then((res: any) => {
                    if (resCodeCheck(res)) { return }
                    resolve(res.data)
                })
            })
        }
        // 优惠券列表请求参数，礼包列表请求参数
        const couponReqOpt = { url: domain + '/Biz/Card/Read', data: { AbleIssued: true, Channels: 'Employee', SendRole: 'WX_Sales', orderBy: 'ActivityEndTime DESC', pageNo: 1, pageSize: 999 } },
            packageReqOpt = { url: domain + '/Biz/CouponPackage/Read', data: { AbleIssued: true, IsOpenEmployee: true, IsSend: true, Status: 0, pageNo: 1, pageSize: 999 } }

        // 并发请求优惠券和礼包数据
        Promise.all([reqP(couponReqOpt), reqP(packageReqOpt)])
            .then((resList: any[]) => {
                console.log(resList[1])
                // tabSlider 数据
                const tabSliderData = []
                // 处理优惠券数据
                tabSliderData[0] = {
                    tabTitle: '优惠券',
                    listType: 'ticket',
                    items: (() => {
                        return resList[0].map(item => {
                            // 投放时间区间
                            return {
                                timeInterval: '投放时间：' + dateFormat('yy/MM/dd', new Date(item.ActivityStartTime)) + '-' + dateFormat('yy/MM/dd', new Date(item.ActivityEndTime)),
                                id: item.Id,
                                title: item.Name,
                                type: item.TypeName,
                                catalog: 'coupon'
                            }
                        })
                    })()
                }
                // 处理礼包数据
                tabSliderData[1] = {
                    tabTitle: '优惠礼包',
                    listType: 'ticket',
                    items: (() => {
                        return resList[1].map(item => {
                            return {
                                timeInterval: '投放时间：' + dateFormat('yy/MM/dd', new Date(item.ActivityStartTime)) + '-' + dateFormat('yy/MM/dd', new Date(item.ActivityEndTime)),
                                id: item.Id,
                                title: item.Name,
                                type: '礼包 含 ' + item.CouponCount + ' 张优惠券',
                                catalog: 'package'
                            }
                        })
                    })()
                }
                // 更新组件
                this.tabSlider.update(tabSliderData)
                this.setData({ loaded: true })
                toast.hide()
            })
    }
    /**
     * 加载游戏列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadGame() {
        request({
            url: domain + '/Game/Minigame/ReadForPickerWithoutScreen',
            data: {
                pageNo: 1,
                pageSize: 999
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            const { data } = res;
            const tabSliderData = [];
            tabSliderData.push({
                tabTitle: '游戏',
                listType: 'text',
                items: (() => {
                    return data.map(item => {
                        return {
                            title: `【${item.GameTypeName}】${item.Title}`,
                            time: `结束时间：${dateFormat('yyyy/MM/dd hh:mm', new Date(item.EndTime))}`,
                            name: item.Title,
                            url: item.GameBackGameUrl,
                            catalog: 'game'
                        }
                    })
                })()
            })

            this.tabSlider.update(tabSliderData)
            this.setData({
                loaded: true
            })
        })
    }

    /**
     * 加载商家位置列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadPosition() { }

    /**
     * 加载问卷调查列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadQuestionnaire() { }

    /**
     * 加载对话模板列表
     * @private
     * @memberof ChatExtendPage
     */
    private loadMsgtpl() { }

    /**
     * sliderItem 点击发送
     * @private
     * @memberof ChatExtendPage
     */
    private sliderItemTap(e) {
        const { catalog } = e.currentTarget.dataset
        // 图文, 店内活动
        if (catalog === "activity") {
            const { id, title, url } = e.currentTarget.dataset;
            modal.show({
                title: '',
                content: '确定发送该活动链接给客户吗？',
            }).then(flag => {
                if (!flag) { return }
                toast.showLoading('发送中...', true);
                const content = `<a href='${url}'>${title}</a>`
                request({
                    url: domain + '/WX/Message/Send',
                    data: {
                        customerId: this.id,
                        contentType: 1, // 文本 
                        IsAllowSuperSend: true,
                        content: content
                    }
                }).then((res: any) => {
                    if (resCodeCheck(res)) { return }
                    toast.hide();
                    modal.show({
                        title: '',
                        content: '发送成功',
                        showCancel: false,
                    }).then(flag => {
                        this.triggerToBack()
                    })
                })
            })
        }
        // 票券，优惠券 或 礼包
        else if (catalog === 'coupon' || catalog === 'package') {
            // 这里 优惠券/礼包的 id 作为 content 发送
            const { id: content } = e.currentTarget.dataset;
            modal.show({
                title: '',
                content: `确定发送该${catalog === 'coupon' ? '优惠券' : '礼包'}给客户吗？`,
            }).then(flag => {
                if (!flag) { return }
                toast.showLoading('发送中...', true);
                request({
                    url: domain + '/WX/Message/Send',
                    data: {
                        customerId: this.id,
                        contentType: catalog === 'coupon' ? 7 : 8,
                        IsAllowSuperSend: true,
                        content: content
                    }
                }).then((res: any) => {
                    if (resCodeCheck(res)) { return }
                    toast.hide();
                    modal.show({
                        title: '',
                        content: res.errormsg === '请求成功' ? '发送成功' : res.errormsg,
                        showCancel: false,
                    }).then(flag => {
                        this.triggerToBack()
                    });
                });
            });
        }
        // 游戏
        else if (catalog === 'game') {
            const { name, url } = e.currentTarget.dataset;
            let content = `<a href='${url}'>${name}</a>`;
            modal.show({
                title: '',
                content: `确定发送该${catalog === 'coupon' ? '优惠券' : '礼包'}给客户吗？`,
            }).then(flag => {
                if (!flag) { return }
                toast.showLoading('发送中...', true);
                request({
                    url: domain + '/WX/Message/Send',
                    data: {
                        customerId: this.id,
                        contentType: 1,
                        IsAllowSuperSend: true,
                        content: content
                    }
                }).then((res: any) => {
                    if (resCodeCheck(res)) { return }
                    toast.hide();
                    modal.show({
                        title: '',
                        content: '发送成功',
                        showCancel: false,
                    }).then(flag => {
                        this.triggerToBack()
                    });
                });
            });
        }
        // 商家位置

    }
    /**
     * 触发父页面刷新并返回
     * @private
     * @memberof ChatExtendPage
     */
    private triggerToBack() {
        const pages = getCurrentPages();
        pages[pages.length - 2].isRefresh = true;
        wx.navigateBack();
    }
    /**
     * Slider 滑动与点击切换
     * @private
     * @param {any} e 
     * @memberof ChatExtendPage
     */
    private changeSlider(e) {
        this.tabSlider.changeSlider(e);
    }
}
Page(new ChatExtendPage());