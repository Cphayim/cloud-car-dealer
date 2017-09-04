import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Selection from '../../../components/selection/selection';
import toast from '../../../modules/toast';
import { domain } from '../../../config/url.config';
import { openSearch } from '../../../components/search/search';
import { request } from '../../../modules/request';
import { enumConfig } from '../../../config/enum.config';
import { resCodeCheck } from '../../../modules/auth';
import { listTimeFormat } from '../../../modules/util';
import { refreshDelay } from '../../../config/config';

/*
 * Tab 客户页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:17 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 15:10:47
 */


// 实例化 Selection 组件类
// const selectionDataJSON = `[{"name":"orderby","title":"排列","type":"select","opts":[{"title":"绑定顾问时间","val":"0"},{"title":"关注时间","val":"1"},{"title":"最近活跃时间","val":"2"}]},{"name":"channel","title":"沟通渠道","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"电话","val":"20"},{"title":"微信","val":"30"}]},{"name":"level","title":"等级","type":"all","opts":[{"title":"全部","val":"all"},{"title":"H","val":"h"},{"title":"A","val":"a"},{"title":"B","val":"b"},{"title":"C","val":"c"}]},{"name":"carModel","title":"车系","type":"screening","opts":[{"title":"一类车","val":"10"},{"title":"二类车","val":"20"},{"title":"三类车","val":"30"}]},{"name":"binding","title":"绑定时间","type":"all","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]},{"name":"pretime","title":"最近联系时间","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]}]`;

const selectionDataObj = [{ "name": "orderby", "title": "排列", "type": "select", "opts": [{ "title": "最近活跃时间", "val": "LastTrackTime DESC" }, { "title": "绑定顾问时间", "val": "BindEmployeeTime DESC" }, { "title": "关注时间", "val": "SubscribeTime DESC" }] }, { "name": "channel", "title": "沟通渠道", "type": "screening", "opts": [{ "title": "全部", "val": "" }, { "title": "电话", "val": "phone" }, { "title": "微信", "val": "wechat" }, { "title": "两者皆有", "val": "and" }] }, { "name": "PreLevel", "title": "等级", "type": "all", "opts": [{ "title": "全部", "val": "" }, { "title": "N", "val": "0" }, { "title": "H", "val": "1" }, { "title": "A", "val": "2" }, { "title": "B", "val": "3" }, { "title": "C", "val": "4" }, { "title": "O(订单)", "val": "5" }, { "title": "O(成交)", "val": "9" }, { "title": "L(流失)", "val": "7" }] }, { "name": "BindTime", "title": "绑定时间", "type": "all", "opts": [{ "title": "全部", "val": "0" }, { "title": "今天", "val": "1" }, { "title": "昨天", "val": "2" }, { "title": "近7日", "val": "3" }, { "title": "本月", "val": "4" }], }, { "name": "LastTime", "title": "最近联系时间", "type": "screening", "opts": [{ "title": "全部", "val": "0" }, { "title": "今天", "val": "1" }, { "title": "昨天", "val": "2" }, { "title": "近7日", "val": "3" }, { "title": "本月", "val": "4" }] }];

const selection = new Selection({
    selectionData: selectionDataObj
});

/**
 * 请求车品牌插入 SelectionData
 */

interface Data {
    pagePath: any;
    // 列表顶部填充层高度
    listPaddingTop: number;
    // selection 对象挂载
    selection: Selection;

    /**
     * 请求相关
     */
    // listCount: number, // 当前列表项数

    /*
     * 枚举相关
     */
    PreLevel: any;
    /**
     * 数据
     */
    clientTotal: number; // 客户总数
    clientList: any[]; // 客户列表
}


class ClientPage extends BasePage {
    private selection: Selection = selection;
    private carBrandFlag = false;
    // 视图滚动属性
    private listPaddingTop: number = 0;
    private selectionHeight: number = 0;
    private searchHeight: number = 0;

    /**
     * 请求参数
     */
    private pageSize: number = 20; // 分页每页数量，用于上拉加载
    private pageNo: number = 0; // 当前页码

    // 排序
    private orderBy: string = 'LastTrackTime DESC'; // 排序

    // 筛选
    private PreLevel: string = ''; // 潜客等级

    private IsHasPhone: boolean = false; // 是否有电话
    private IsSubscribe: boolean = false; // 是否关注

    private CarBrandId: number = 0; // 意向车型

    private BindTime: string = '0'; // 绑定时间
    private LastTime: string = '0'; // 最近联系时间


    private data: Data = {
        pagePath: pagePath,
        // 列表顶部填充层高度
        listPaddingTop: this.listPaddingTop,
        // selection 对象挂载
        selection: this.selection,

        // listCount: 0, // 当前列表项数

        /*
         * 枚举相关
         */
        PreLevel: enumConfig.PreLevel,
        /**
         * 数据
         */
        clientTotal: 0, // 客户总数
        clientList: [], // 客户列表
    }
    // 搜索组件 入口方法挂载
    public openSearch = openSearch;
    /**
     * 展开下拉选项卡
     * 触发条件：Select tap 事件
     * @param {Object} e eventObject 
     */
    public showSelect(e) {
        this.selection.showSelect(e);
    }
    /**
     * 用于更新已选项（Select下拉选项）
     * 触发条件： Option-list 上的委托事件，接收来自 option 的 tap 事件冒泡
     * @param {Object} e eventObject 
     */
    public chooseOption(e) {
        const query = this.selection.chooseOption(e);
        if (query) {
            this.setRequestDataByQuery(query);
            this.addListItem(true);
        }
    }
    /**
     * 显示筛选盒子
     * 触发条件：Select 中 Screening Tap 事件
     * @param {Object} e eventObject
     */
    public showScreening(e) {
        this.selection.showScreening(e);
    }
    /**
     * 完成筛选，隐藏筛选盒子
     * 触发条件：screening-list-group 中完成按钮 tap 事件
     * @param {Object} e eventObject
     */
    public finishScreening(e) {
        this.selection.finishScreening(e);
        /**
         * 对客户列表进行操作
         */
        this.addListItem(true);
    }
    /**
     * 切换筛选列表
     * 触发条件：筛选列表头 tap 事件
     * @param {Object} e eventObject
     */
    public switchScreening(e) {
        this.selection.switchScreening(e);
    }
    /**
     * 更新 筛选列表的已选项
     * 触发条件：筛选列表上的委托事件，接收来自 筛选列表项 的 tap 事件冒泡
     * @param {Object} e eventObject
     */
    public chooseScreeningOption(e) {
        const query = this.selection.chooseScreeningOption(e);
        if (query) {
            this.setRequestDataByQuery(query);
        }
    }
    /**
     * 关闭遮罩层
     * @param {Object} e eventObject
     */
    public closeMask(e) {
        this.selection.closeMask(e);
    }
    /**
     * 重置查询
     */
    public resetQuery(e) {
        const query = this.selection.resetQuery();
        if (query) {
            this.setRequestDataByQuery(query);
        }
    }
    /**
     * 通过 query 设置 请求参数
     * @param query selection 组件选项变化时返回的查询对象
     */
    public setRequestDataByQuery(query) {
        // 排序
        this.orderBy = query.orderby.val;
        // 沟通渠道
        this.IsHasPhone = query.channel.val == 'phone' || query.channel.val == 'and';
        this.IsSubscribe = query.channel.val == 'wechat' || query.channel.val == 'and';
        // 等级
        this.PreLevel = query.PreLevel.val;
        // 车系
        this.CarBrandId = query.CarBrandId.val;
        // 绑定时间
        this.BindTime = query.BindTime.val;
        // 最近联系时间
        this.LastTime = query.LastTime.val;
    }
    /**
     * 添加列表数据
     * @param {boolean} isReset 是否重置数据列表
     * @param {boolean} isRefresh 是否来自下拉刷新
     * @returns 
     */
    private addListItem(isReset = false, isRefresh = false) {
        let msg = isRefresh ? '正在刷新' : '正在加载';
        toast.showLoading(msg, true);
        // 如果是刷新重置部分请求配置
        if (isReset) {
            this.pageNo = 0;
            this.data.clientList = [];
        }

        this.requestList()
            .then((res: any) => {
                if (resCodeCheck(res)) {
                    return;
                }
                // 总数
                this.data.clientTotal = res.total;

                // 时间处理
                res.data.forEach(item => {
                    /**
                     * 根据排序选项调整
                     */
                    const timefield = 'LastTrackTime';
                    item.time = listTimeFormat(item[timefield]);
                    return item;
                });

                //
                this.data.clientList = this.data.clientList.concat(res.data);

                const delay = isRefresh ? refreshDelay : 0;
                setTimeout(() => {
                    this.setData({
                        clientTotal: this.data.clientTotal,
                        clientList: this.data.clientList
                    });
                    if (isRefresh) {
                        wx.stopPullDownRefresh();
                        toast.showSuccess('刷新成功');
                    } else {
                        toast.hide();
                    }
                }, delay);
            });
    }
    /**
     * 请求数据
     */
    private requestList() {
        const data: any = {
            ticket: wx.getStorageSync('ticket'),
            PageSize: this.pageSize,
            PageNo: ++this.pageNo,
            // 排序
            orderBy: this.orderBy,
            // 沟通渠道
            IsHasPhone: this.IsHasPhone,
            IsSubscribe: this.IsSubscribe,
            // 等级
            PreLevel: this.PreLevel,
            BindTime: this.BindTime,
            LastTime: this.LastTime
        }

        // 如果有车型添加车型参数
        if (this.CarBrandId) {
            data.CarBrandId = this.CarBrandId
        }

        return request({
            url: domain + '/ApiCustomerPre/ReadForSearchView',
            data: data
        });
    }
    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        // 页面加载时调用 selection 的 init 方法初始化组件
        this.selection.init();

        this.requestCarBrand();

        // 获取 search 入口组件高度
        let p1 = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-search-outer').boundingClientRect(rect => {
                resolve(rect.height);
            }).exec();
        });
        // 获取 selection 组件高度
        let p2 = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-options-box').boundingClientRect(rect => {
                resolve(rect.height);
            }).exec();
        });
        // 设置 listPaddingTop
        Promise.all([p1, p2]).then((resAll: number[]) => {
            this.searchHeight = resAll[0];
            this.selectionHeight = resAll[1];
            this.listPaddingTop = this.searchHeight + this.selectionHeight;
            this.setData({
                listPaddingTop: this.listPaddingTop,
            });
        });

        // 初始化添加一次数据
        this.addListItem();
    }

    /**
     * 请求车型
     */
    requestCarBrand() {
        request({
            url: domain + '/ApiCustomerPre/GetCarBrandList',
            data: {
                ticket: wx.getStorageSync('ticket')
            }
        }).then((res: any) => {
            if (res.errorcode) {
                return;
            }
            const screening: any = {
                name: 'CarBrandId',
                title: '车系',
                type: 'screening'
            }
            const opts: any[] = res.data.map(item => {
                const obj = {
                    title: item.CarBrandName,
                    val: item.CarBrandId
                }
                return obj;
            });
            opts.unshift({
                title: '全部',
                val: 0
            })
            screening.opts = opts;

            selectionDataObj.splice(3, 0, screening);
            // console.log(selectionDataObj);
            this.selection.update(selectionDataObj);

            this.carBrandFlag = true;
        });
    }

    /**
     * 跳转到客户详情
     * @param e 
     */
    public toDetail(e) {
        const { id, name } = e.currentTarget.dataset;
        wx.navigateTo({
            url: pagePath['customer-info'] + '?id=' + id + '&name=' + name
        });
    }

    private onReady() {
    }
    private onShow() { }
    private onHide() { }
    private onUnload() { }
    private onPullDownRefresh() {
        this.addListItem(true, true);
    }
    private onReachBottom() {
        this.addListItem();
    }
    private onShareAppMessage() { }
}

Page(new ClientPage());