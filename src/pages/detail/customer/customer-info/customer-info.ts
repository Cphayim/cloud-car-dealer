import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import TabSlider from '../../../../components/tab-slider/tab-slider';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck, reLogin } from '../../../../modules/auth';
import { dateFormat } from '../../../../modules/util';
import { enumConfig } from '../../../../config/enum.config';
import { refreshDelay } from '../../../../config/config';
/*
 * 客户详情 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 10:04:46 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 11:40:09
 */

// 创建 tabSlider 对象
const tabSlider = new TabSlider({
    heightRatio: 0.6
});


interface Data {
    loaded: boolean;
    introData?: {
        avatar?: string,
        realname?: string,
        username?: string,
        source?: string,
        time?: string,
        customerId?: number,
        phone?: string
    };
    tabSlider: TabSlider;

    // 跟进信息
    discuss: {
        // 是否有正在审核的流失
        IsLose?: boolean;
        // 经销商是否开启回访
        IsOpenReVisit?: boolean;
        // 潜客等级枚举值
        PreLevel?: number;
        // 潜客等级字符串
        PreLevelStr?: string;
        // 流失类型
        LoseType?: number;

        /**
         * 类别
         */
        // 大类
        VisitType?: number; // 1 回访 2 到店 3交车
        // 小类
        ItemType?: number; // 1 回访 2 邀约 3 其他 4 活动 5 试驾 6交车 

        // 回访 邀约 到店
        // 计划时间
        NextTime?: string;

        // 计划交车时间
        DeliverDate?: string;
        // 交车时间
        DealTime?: string;
    }
}

// 跟进信息默认对象，每次重新加载时还原后再修改
const discussBase = {
    IsLose: false,
    IsOpenReVisit: false,
    PreLevel: 0,
    PreLevelStr: '',
    LoseType: 0,


    VisitType: 0,
    ItemType: 0,

    NextTime: '',

    DeliverDate: '',
    DealTime: '',


}

class CustomerPage extends BasePage {
    // 是否在 onShow 时 重新调用 loadData 方法，通过子页面设置
    private refreshFlag: boolean = false; 
    private id: number = 0;
    private res: any;
    private tabSlider: TabSlider = tabSlider;

    // 潜客等级枚举
    private enumPreLevel = enumConfig.PreLevel;
    private enumLoseType = enumConfig.LoseType;

    public data: Data = {
        loaded: false,
        introData: {},
        tabSlider: tabSlider,

        discuss: JSON.parse(JSON.stringify(discussBase))
    }
    /**
     * 设置等级
     * @param e 
     */
    public setLevel(e) {
        if (!this.res) {
            return;
        }
        // 如果 (客户等级为0(订单) && 有交车时间) || 客户等级为O(成交)
        if ((this.data.discuss.PreLevel == 5 && this.data.discuss.DealTime) || this.data.discuss.PreLevel == 9) {
            wx.showModal({
                title: '客户已成交，无法修改等级',
                showCancel: false,
                confirmColor: '#54b4ef'
            });
            return;
        } else if (this.data.discuss.PreLevel == 5 && !this.data.discuss.DealTime) {
            wx.showModal({
                title: '请先取消交车，再修改等级',
                showCancel: false,
                confirmColor: '#54b4ef'
            });
            return;
        } else if (this.data.discuss.PreLevel == 7) {
            wx.showModal({
                title: '客户已流失，不可修改等级',
                showCancel: false,
                confirmColor: '#54b4ef'
            });
            return;
        }

        switch (this.data.discuss.PreLevel) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                new Promise((resolve, reject) => {
                    wx.showActionSheet({
                        itemList: ['H', 'A', 'B', 'C', 'O(订单)', 'L(流失)'],
                        itemColor: '#54b4ef',
                        success(res) {
                            resolve(res.tapIndex);
                        }
                    });
                }).then((index: number) => {
                    // H,A,B,C 直接设置
                    if (index < 4) {
                        const type = index + 1;
                        request({
                            url: domain + '/UC/CustomerPre/SetPreLevel',
                            data: {
                                ticket: wx.getStorageSync('ticket'),
                                ids: this.id,
                                type: type
                            }
                        }).then(res => {
                            if (resCodeCheck(res)) {
                                return;
                            }
                            this.loadData();
                        });
                    }
                    // O(订单)
                    if (index == 4) {
                        wx.navigateTo({
                            url: pagePath['customer-order'] + '?id=' + this.id
                        });
                    }
                })
            default:
                break;
        }


    }

    /**
     * 设置跟进信息
     * @param data request => res.data
     */
    private loadDiscuss() {
        if (!this.res) {
            return;
        }
        // 重置 discuss
        this.data.discuss = JSON.parse(JSON.stringify(discussBase));

        /**
         * 是否是正在审核的流失状态
         * 通过返回 data 的实体 customerLose 中 Id 是否有值判断
         */
        const isLose: boolean = !!this.res.customerLose.Id;
        this.data.discuss.IsLose = isLose;
        /**
         * 本地缓存获取经销商数据，
         * 若没有经销商信息则强制重新登录
         */
        const tenant: any = wx.getStorageSync('tenant');
        if (!tenant) {
            reLogin(); return;
        }
        // 经销商是否开启回访
        this.data.discuss.IsOpenReVisit = tenant.IsOpenReVisit;

        /**
         * 潜客等级
         */
        // 潜客等级枚举值
        this.data.discuss.PreLevel = this.res.customer.PreLevel;
        // 如果不是正在审核的流失状态
        if (!isLose) {
            // 潜客等级字符串
            this.data.discuss.PreLevelStr = (() => {
                // 将 潜客等级枚举值 对应的字符串 赋给 潜客等级字符串
                let preLevelStr: string = this.enumPreLevel[this.res.customer.PreLevel];
                // 判断 潜客等级枚举值对应的是不是 L 流失等级
                // 如果是 L 流失等级 追加流失类型
                if (this.res.customer.PreLevel == 7) {
                    /**
                     * 这里后端返回参数名有错误
                     * data.customer 实体下为 LossType
                     * data.customerLose 实体下为 LoseType
                     * 注意区分
                     */
                    // 流失状态
                    this.data.discuss.LoseType = this.res.customer.LossType;
                    // 字符串 追加流失状态 (如: "L(流失) - 战败" )
                    preLevelStr += ' - ' + this.enumLoseType[this.res.customer.LossType];
                }
                // 返回供视图显示的 潜客等级字符串
                return preLevelStr;
            })();
        }
        // 如果是正在审核的流失状态
        else {
            this.data.discuss.PreLevelStr = "流失审核中";
        }

        /**
         * 计划 XX
         */

        // 大类
        this.data.discuss.VisitType = this.res.customerVisit.VisitType;
        // 小类
        this.data.discuss.ItemType = this.res.customerVisit.ItemType;

        if (!isLose) {

            // 计划时间
            this.data.discuss.NextTime = this.res.customerVisit.NextTimeStr;

            // 计划交车时间
            this.data.discuss.DeliverDate = this.res.customer.DeliverDateStr || '';
            // 交车时间
            this.data.discuss.DealTime = this.res.customer.DealTime || '';
        }


        this.setData({
            discuss: this.data.discuss
        });
    }

    private onLoad(options) {
        const id = ~~options.id,
            name = options.name;
        this.id = id;
        wx.setNavigationBarTitle({
            title: name || '客户详情'
        });

        this.loadData();
    }

    private onShow(){
        if(this.refreshFlag){
            this.loadData();
            this.refreshFlag = false;
        }
    }
    /**
     * 加载数据
     */
    private loadData() {
        toast.showLoading();
        request({
            url: domain + '/ApiCustomerPre/ReadForPreDetail',
            data: {
                ticket: wx.getStorageSync('ticket'),
                id: this.id
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) {
                return;
            }
            const data = res.data;
            // 生成 intro 组件数据
            this.data.introData = {
                avatar: data.customer.HeadImgUrl,
                realname: data.customer.Name,
                username: data.customer.Nickname,
                source: data.customer.CustomerFrom,
                time: dateFormat('yyyy.MM.dd', new Date(data.customer.BecomeTime)),
                customerId: data.customer.Id,
                phone: data.customer.MobilePhone
            }

            // 保存响应数据
            this.res = data;

            // 跟进记录与客户轨迹
            const tabSliderData = [{
                // 渲染到 顶部 Tab
                tabTitle: '跟进记录',
                // 列表类型，决定了渲染出来的样式布局
                // 可选值 'text':文字列表、'graphic':图文列表、'tickt':票券列表
                listType: 'axis',
                // 列表项，视图层根据列表类型选择对应的模板渲染，多余的项会被忽略
                items: []
            }, {
                tabTitle: '客户轨迹',
                listType: 'axis',
                items: []
            }];

            const items1 = data.discussRecord.map(item => {
                const reg = /^(\d{4}\/\d{2}\/\d{2}).*(\d{2}:\d{2}:\d{2})$/;
                const datearr = item.CreateTime.match(reg);
                return {
                    date: datearr[1],
                    time: datearr[2],
                    content: (item.Title == '微信' ? '微信对话' : item.Title) + ' ' + item.Content
                }
            });

            const items2 = data.track.map(item => {
                const reg = /^(\d{4}\/\d{2}\/\d{2}).*(\d{2}:\d{2}:\d{2})$/;
                const datearr = item.Date.match(reg);
                return {
                    date: datearr[1],
                    time: datearr[2],
                    content: item.Title + ' 浏览次数: ' + item.Count
                }
            });
            tabSliderData[0].items = items1;
            tabSliderData[1].items = items2;

            this.tabSlider.update(tabSliderData);

            // 设置跟进信息
            this.loadDiscuss();

            toast.hide();
            this.setData({
                loaded: true,
                introData: this.data.introData
            });
        });
    }

    private onPullDownRefresh() {

    }
    /**
     * tabSlider 切换事件
     * @param {object} e 
     */
    private changeSlider(e) {
        this.tabSlider.changeSlider(e);
    }

    public callPhone(e) {
        const phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    }
    public openChat(e) {
        const id = e.currentTarget.dataset.customerId;
        wx.navigateTo({
            url: pagePath.dialogue + "?id=" + id
        });
    }
}
Page(new CustomerPage());