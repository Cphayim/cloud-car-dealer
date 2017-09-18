import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import TabSlider from '../../../../components/tab-slider/tab-slider';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck, reLogin } from '../../../../modules/auth';
import { dateFormat } from '../../../../modules/util';
import { enumConfig } from '../../../../config/enum.config';
import { refreshDelay } from '../../../../config/config';
import { modal } from '../../../../modules/modal';
import { actionSheet } from '../../../../modules/actionsheet';
/*
 * 客户详情 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 10:04:46 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:25:12
 */

// 创建 tabSlider 对象
const tabSlider = new TabSlider({
    heightRatio: 0.6
});


interface Data {
    loaded: boolean;
    pagePath: any;
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

    // 枚举对象
    enumPreLevel: any;
    enumLoseType: any;
    enumVisitItem: any;

    // 跟进信息
    discuss: {
        IsLose?: boolean; // 是否正在流失审核
        IsOpenReVisit?: boolean; // 经销商是否开启回访

        PreLevel?: number; // 潜客等级枚举值
        PreLevelStr?: string; // 潜客等级字符串

        LoseType?: number; // 流失类型枚举值
        LoseTypeStr?: string; // 流失类型字符串
        LoseId?: number; // 流失 id ( 注意不是客户 id )
        DefeatCarBrand?: string; // 战败品牌
        DefeatReason?: string; // 战败原因

        // 类别
        VisitType?: number; // 1 回访 2 到店 3交车
        ItemType?: number; // 1 回访 2 邀约 3 其他 4 活动 5 试驾 6交车 

        NextTime?: string; // 计划时间 用于 回访 邀约 到店
        DeliverDate?: string; // 计划交车时间
        DealTime?: string; // 成交时间
    }

    // 基本信息
    basic: {
        MobilePhone: string, // 手机号
        CarModel: string, // 意向车型 
        ContrastCarModel: string, // 对比车型
        KeepCarModel: string, // 保有车型
        CarWay: string, // 购车方式
        BuyTimeRange: string, // 购车预算
    }
}

// 跟进信息默认对象，每次重新加载时还原后再修改
const discussBase = {
    IsLose: false,
    IsOpenReVisit: false,

    PreLevel: 0,
    PreLevelStr: '',

    LoseType: 0,
    LoseTypeStr: '',
    LoseId: 0,
    DefeatCarBrand: '',
    DefeatReason: '',

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
    private enumPreLevel: any = enumConfig.PreLevel;
    private enumLoseType: any = enumConfig.LoseType;
    private enumVisitItem: any = enumConfig.CustomerVisitItem;

    public data: Data = {
        loaded: false,
        pagePath: pagePath,
        introData: {},
        tabSlider: tabSlider,

        enumPreLevel: this.enumPreLevel,
        enumLoseType: this.enumLoseType,
        enumVisitItem: this.enumVisitItem,

        discuss: JSON.parse(JSON.stringify(discussBase)),

        basic: {
            MobilePhone: '', // 手机号
            CarModel: '', // 意向车型 
            ContrastCarModel: '', // 对比车型
            KeepCarModel: '', // 保有车型
            CarWay: '', // 购车方式 
            BuyTimeRange: '', // 购车预算
        }
    }

    private onLoad(options) {
        const id = ~~options.id,
            // name = options.name;
            name = '';
        this.id = id;
        wx.setNavigationBarTitle({
            title: name || '客户详情'
        });

        this.loadData();
    }

    private onShow() {
        if (this.refreshFlag) {
            this.loadData();
            this.refreshFlag = false;
        }
    }


    /**
     * 加载数据
     * @private
     * @param {boolean} [isRefresh=false] 是否是下拉刷新触发
     * @memberof CustomerPage
     */
    private loadData(isRefresh = false) {
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
                // 列表类型
                listType: 'axis',
                // 列表项
                items: []
            }, {
                tabTitle: '客户轨迹',
                listType: 'axis2',
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

            const items2 = data.trackGroup.map(item => {
                const newItem:any = {};
                newItem.date = item.Date || '猴年马月';
                newItem.childList = item.Childs.map(childItem=>{
                    const newChildItem:any = {};
                    newChildItem.title = childItem.Title || '';
                    newChildItem.count = childItem.Count || 0;
                    return newChildItem;
                });
                return newItem;
            });
            tabSliderData[0].items = items1;
            tabSliderData[1].items = items2;
            console.log(tabSliderData)
            this.tabSlider.update(tabSliderData);

            // 设置跟进信息
            this.loadDiscuss();

            // 设置基本信息
            this.data.basic = {
                MobilePhone: data.customer.MobilePhone || '',
                CarModel: data.customer.CarModel || '',
                ContrastCarModel: data.customer.ContrastCarModel || '',
                KeepCarModel: data.customer.KeepCarModel || '', // 保有车型
                CarWay: data.customer.IsLoan || '', // 购车方式 
                BuyTimeRange: data.customer.BuyTimeRange || '', // 购车预算
            }

            toast.hide();
            const delay = isRefresh ? refreshDelay : 100;
            setTimeout(() => {
                this.setData({
                    loaded: true,
                    introData: this.data.introData,
                    basic: this.data.basic
                });
                isRefresh && toast.showSuccess('刷新成功');
            }, delay);

        });
    }

    /**
     * 加载跟进信息
     * @param data request => res.data
     */
    private loadDiscuss() {
        // 容器是否有响应数据
        if (!this.res) {
            return;
        }
        // 重置 discuss
        this.data.discuss = JSON.parse(JSON.stringify(discussBase));

        /**
         * 本地缓存中获取经销商数据，若没有经销商信息则强制重新登录
         */
        const tenant: any = wx.getStorageSync('tenant');
        if (!tenant) { reLogin(); return; }
        // 经销商是否开启回访
        this.data.discuss.IsOpenReVisit = tenant.IsOpenReVisit;

        /**
         * 是否是正在流失审核状态
         * 通过返回 data 的实体 customerLose 中 Id 是否有值判断
         */
        const isLose: boolean = !!this.res.customerLose.Id;
        this.data.discuss.IsLose = isLose;

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
                    // 流失类型枚举值
                    this.data.discuss.LoseType = this.res.customer.LossType;
                    // 流失类型字符串
                    this.data.discuss.LoseTypeStr = this.enumLoseType[this.data.discuss.LoseType];
                    // 字符串 追加流失状态 (如: "L(流失) - 战败" )
                    preLevelStr += ' - ' + this.data.discuss.LoseTypeStr;
                    // 战败品牌
                    this.data.discuss.DefeatCarBrand = this.res.customer.DefeatCarBrand;
                    // 战败原因
                    this.data.discuss.DefeatReason = this.res.customer.DefeatReason;
                }
                // 返回供视图显示的 潜客等级字符串
                return preLevelStr;
            })();
        }
        // 如果是正在审核的流失状态
        else {
            this.data.discuss.PreLevelStr = "流失审核中";
            this.data.discuss.LoseId = this.res.customerLose.Id;
        }

        /**
         * 计划回访、邀约、到店、交车
         */
        this.data.discuss.VisitType = this.res.customerVisit.VisitType;
        this.data.discuss.ItemType = this.res.customerVisit.ItemType;
        if (!isLose) {
            // 计划时间
            this.data.discuss.NextTime = this.res.customerVisit.NextTimeStr;
            // 计划交车时间
            this.data.discuss.DeliverDate = this.res.customer.DeliverDateStr || '';
            // 成交时间
            this.data.discuss.DealTime = this.res.customer.DealTime || '';
        }

        // 同步数据到视图层
        this.setData({
            discuss: this.data.discuss
        });
    }


    /**
     * 设置等级
     * @param {any} e 
     * @memberof CustomerPage
     */
    public setLevel(e) {
        if (!this.res) {
            return;
        }
        const isLose = e.currentTarget.dataset.islose;

        // (客户等级为O(订单) && 有交车时间) || 客户等级为O(成交)
        if ((this.data.discuss.PreLevel == 5 && this.data.discuss.DealTime) || this.data.discuss.PreLevel == 9) {
            modal.show({
                title: '',
                content: '客户已成交，无法修改等级',
                showCancel: false,
            });
            return;
        }
        // 客户等级为O(订单) && 没有交易时间
        else if (this.data.discuss.PreLevel == 5 && !this.data.discuss.DealTime) {
            modal.show({
                title: '',
                content: '请先取消交车，再修改等级',
                showCancel: false,
            });
            return;
        }
        // 客户等级为L(流失) 
        else if (this.data.discuss.PreLevel == 7) {
            modal.show({
                title: '',
                content: '客户已流失，不可修改等级',
                showCancel: false,
            });
            return;
        }

        if (!isLose) {
            switch (this.data.discuss.PreLevel) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    actionSheet.show({
                        itemList: ['H', 'A', 'B', 'C', 'O(订单)', 'L(流失)']
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
                        // L(流失)
                        if (index == 5) {
                            actionSheet.show({
                                itemList: ['战败', '拒访', '失联']
                            }).then((index: number) => {
                                // 需要做判断是否有 index，不然点取消也会跳转
                                if (typeof index === 'number') {
                                    wx.navigateTo({
                                        url: pagePath['customer-lose'] + '?type=' + index + '&id=' + this.id
                                    });
                                }
                            });
                        }
                    });
                default:
                    break;
            }
        } else {
            actionSheet.show({
                itemList: ['重新填写', '取消申请']
            }).then((index: number) => {
                if (index === 0) {
                    // 重新填写
                    actionSheet.show({
                        itemList: ['战败', '拒访', '失联']
                    }).then((index: number) => {
                        // 需要做判断是否有 index，不然点取消也会跳转
                        if (typeof index === 'number') {
                            wx.navigateTo({
                                url: pagePath['customer-lose'] + '?type=' + index + '&id=' + this.id
                            });
                        }
                    });
                } else if (index === 1) {
                    // 取消申请
                    modal.show({
                        title: '',
                        content: '是否取消流失申请？',
                        cancelText: '否',
                        confirmText: '是'
                    }).then(flag => {
                        if (flag) {
                            request({
                                url: domain + '/UC/CustomerLose/SetStatus9',
                                data: {
                                    ticket: wx.getStorageSync('ticket'),
                                    Id: this.data.discuss.LoseId
                                }
                            }).then(res => {
                                if (resCodeCheck(res)) { return }
                                toast.showSuccess('已取消流失申请');
                                this.loadData();
                            });
                        }
                    })
                }
            });
        }

    }

    /**
     * 修改 回访、邀约、到店状态
     * @param {any} e 
     * @memberof CustomerPage
     */
    public setVisitStatus(e) {
        const { VisitType: visitType, ItemType: itemType } = this.data.discuss;
        if (visitType == 1) {
            if (itemType == 1) { // 回访
                actionSheet.show({
                    itemList: ['已回访', '修改为计划邀约', '修改为计划到店']
                }).then(index => {
                    switch (index) {
                        case 0: // 已回访
                            const status = 0;
                            wx.navigateTo({
                                // 参数 id=客户id & type=visit(视图模板) & status=status(状态)
                                url: `${pagePath['customer-discuss']}?id=${this.id}&type=visit&status=${status}`
                            });
                            break;
                        case 1: // 修改未计划邀约，直接修改
                            modifyVisitStatus([1, 2]);
                            break;
                        case 2: // 修改为计划到店
                            wx.navigateTo({
                                // 参数 id=客户id & type=tostore(视图模板) & storeDate=NextTime(计划时间)  & first=1(是否首次)
                                url: `${pagePath['customer-discuss']}?id=${this.id}&type=tostore&storeDate=${this.data.discuss.NextTime}&first=1`
                            });
                            break;
                    }
                });
            } else if (itemType == 2) { // 邀约
                actionSheet.show({
                    itemList: ['已邀约', '修改为计划回访', '修改为计划到店']
                }).then(index => {
                    switch (index) {
                        case 0: // 已邀约
                            const status = 1;
                            wx.navigateTo({
                                // 参数 id=客户id & type=visit(视图模板) & status=status(状态)
                                url: `${pagePath['customer-discuss']}?id=${this.id}&type=visit&status=${status}`
                            });
                            break;
                        case 1: // 修改未计划回访，直接修改
                            modifyVisitStatus([1, 1]);
                            break;
                        case 2: // 修改为计划到店
                            wx.navigateTo({
                                // 参数 id=客户id & type=tostore(视图模板) & storeDate=NextTime(计划时间)  & first=1(是否首次)
                                url: `${pagePath['customer-discuss']}?id=${this.id}&type=tostore&storeDate=${this.data.discuss.NextTime}&first=1`
                            });
                            break;
                    }
                });
            }
        } else if (visitType == 2) {
            actionSheet.show({
                itemList: ['已到店', '修改到店时间', '取消到店']
            }).then(index => {
                switch (index) {
                    case 0: // 已到店
                        const status = 2;
                        wx.navigateTo({
                            // 参数 id=客户id & type=visit(视图模板) & status=status(状态)
                            url: `${pagePath['customer-discuss']}?id=${this.id}&type=visit&status=${status}`
                        });
                        break;
                    case 1: // 修改到店时间
                        wx.navigateTo({
                            // 参数 id=客户id & type=tostore(视图模板) & storeDate=NextTime(计划时间) & itemType=ItemType(到店目的) & first=0(是否首次)
                            url: `${pagePath['customer-discuss']}?id=${this.id}&type=tostore&storeDate=${this.data.discuss.NextTime}&itemType=${this.data.discuss.ItemType}&first=0`
                        });
                        break;
                    case 2: // 取消到店
                        modal.show({
                            title: '',
                            content: '是否取消到店',
                            cancelText: '否',
                            confirmText: '是'
                        }).then(flag => {
                            if (flag) {
                                request({
                                    url: domain + '/UC/CustomerVisit/SetCancelStore',
                                    data: {
                                        ticket: wx.getStorageSync('ticket'),
                                        CustomerId: this.id
                                    }
                                }).then(res => {
                                    if (resCodeCheck(res)) { return }
                                    toast.showSuccess('已取消到店');
                                    this.loadData();
                                });
                            }
                        });
                        break;
                }
            });
        }

        const modifyVisitStatus = ([VisitType, VisitItem]: number[]) => {
            request({
                url: domain + '/UC/CustomerVisit/ModifyVisitStatus',
                data: {
                    ticket: wx.getStorageSync('ticket'),
                    CustomerId: this.id,
                    VisitType: VisitType,
                    VisitItem: VisitItem,
                    NextTime: dateFormat('yyyy/MM/dd', new Date())
                }
            }).then(res => {
                if (resCodeCheck(res)) { return; }
                toast.showSuccess('修改成功');
                this.loadData();
            });
        }
    }

    /**
     * 设置交车
     * @param {any} e 
     * @memberof CustomerPage
     */
    public setDeliver(e) {
        actionSheet.show({
            itemList: ['已交车', '修改交车时间', '取消交车']
        }).then(index => {
            switch (index) {
                case 0: // 已交车 -> 成交信息
                    wx.navigateTo({
                        url: `${pagePath['customer-deal']}?id=${this.id}`
                    });
                    break;
                case 1: // 修改交车时间 -> 订单信息
                    wx.navigateTo({
                        url: `${pagePath['customer-order']}?id=${this.id}&first=0`
                    });
                    break;
                case 2:
                    modal.show({
                        title: '',
                        content: '是否取消交车?',
                        cancelText: '否',
                        confirmText: '是'
                    }).then(flag => {
                        if (flag) {
                            request({
                                url: domain + '/UC/CustomerVisit/SetCancelOrder',
                                data: {
                                    ticket: wx.getStorageSync('ticket'),
                                    id: this.id
                                }
                            }).then(res => {
                                if (resCodeCheck(res)) { return }
                                toast.showSuccess('已取消交车');
                                this.loadData();
                            });
                        }
                    })
                    break;
            }
        })
    }
    /**
     * tabSlider 切换事件
     * @param {object} e 
     */
    private changeSlider(e) {
        this.tabSlider.changeSlider(e);
    }

    /**
     * 添加备注
     * @param {any} e 
     * @memberof CustomerPage
     */
    public addRemark(e) {
        wx.navigateTo({
            url: `${pagePath['customer-discuss']}?id=${this.id}&type=remark`
        });
    }
    /**
     * 拨打电话
     * @param {any} e 
     * @memberof CustomerPage
     */
    public callPhone(e) {
        const phone = e.currentTarget.dataset.phone;
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone
            });
        } else {
            toast.showWarning('该客户未登记手机号');
        }
    }

    /**
     * 进入聊天界面
     * @param {any} e 
     * @memberof CustomerPage
     */
    public openChat(e) {
        const id = e.currentTarget.dataset.customerId;
        wx.navigateTo({
            url: pagePath.chat + "?id=" + id+'&name='+this.data.introData.realname
        });
    }
    /**
     * 页面跳转
     * @param {any} e 
     * @memberof CustomerPage
     */
    public navigato(e) {
        const path = e.currentTarget.dataset.pagePath;
        wx.navigateTo({
            url: path + '?id=' + this.id
        });
    }
    /**
     * 下拉刷新
     * @private
     * @memberof CustomerPage
     */
    private onPullDownRefresh() {
        this.loadData(true);
    }
}
Page(new CustomerPage());