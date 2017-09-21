import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Selection from '../../../components/selection/selection';
import toast from '../../../modules/toast';
import { dateFormat, listTimeFormat } from '../../../modules/util';
import { domain } from '../../../config/config';
import { enumConfig } from '../../../config/enum.config.js';
import { openSearch } from '../../../components/search/search';
import { request } from '../../../modules/request';
import { resCodeCheck } from '../../../modules/auth';
import { refreshDelay } from '../../../config/config';


/*
 * Tab 业务页逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-03 10:45:33 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-20 15:39:13
 */



const selectionJSON = `[{ "name": "PreFrom", "title": "类型", "type": "select", "opts": [{ "title": "全部", "val": "" }, { "title": "试驾预约", "val": "1" }, { "title": "购车询价", "val": "2" }, { "title": "二手置换", "val": "3" }, { "title": "新车", "val": "4" }, { "title": "二手车", "val": "5" }, { "title": "购车优惠", "val": "7" }, { "title": "销售咨询", "val": "8" }] }, { "name": "PreStatus", "title": "状态", "type": "select", "opts": [{ "title": "全部", "val": "" }, { "title": "未联系", "val": "2" }, { "title": "已联系", "val": "9" }, { "title": "已到店", "val": "11" }, { "title": "无效", "val": "10" }] }]`;

// 实例化 selection 组件对象
const selection = new Selection({
    isExistScreening: false, // 不存在 Screening-box
    selectionData: JSON.parse(selectionJSON) // 数据
});

class BusinessPage extends BasePage {
    private selection: Selection = selection;

    // 视图滚动属性
    private searchHeight: number = 0;
    private selectionHeight: number = 0;
    private listPaddingTop: number = 0;

    public data: any = {
        loaded: false,
        pagePath: pagePath,
        // 列表顶部填充层高度
        listPaddingTop: this.listPaddingTop,
        // selection 对象挂载
        selection: this.selection,
        /**
         * 请求相关
         */
        pageSize: 20, // 分页每页数量，用于上拉加载
        pageNo: 0, // 当前页码
        listCount: 0, // 当前列表项数
        orderBy: 'CreateTime desc,Status asc',
        PreFrom: '',
        Status: '',

        /*
         * 枚举相关
         */
        OpportunityPreFrom: enumConfig.OpportunityPreFrom,
        OpportunityStatus: enumConfig.OpportunityPreStatus,
        /**
         * 数据
         */
        businessTotal: 0, // 业务总数
        businessList: [], // 业务列表
    }
    /**
     * 搜索框 tap 事件
     * @param {any} e 
     * @memberof BusinessPage
     */
    public openSearch(e) {
        // openSearch(e);
        toast.showWarning('搜索模块正在开发');
    }
    /**
     * 展开下拉选项卡
     * 触发条件：Select tap 事件
     * @param {Object} e eventObject 
     */
    public showSelect(e) {
        this.data.selection.showSelect(e);
    }

    /**
     * 用于更新已选项（Select下拉选项）
     * 触发条件： Option-list 上的委托事件，接收来自 option 的 tap 事件冒泡
     * @param {Object} e eventObject 
     */
    public chooseOption(e) {
        // 获取筛选参数
        let query = this.selection.chooseOption(e);
        // 如果有 query 的话，执行请求，没有 query 代表点击了当前已选的选项，会返回 false
        if (query) {
            this.data.PreFrom = query.PreFrom.val;
            this.data.Status = query.PreStatus.val;
            this.addListItem(true);
        }
    }


    /**
     * 关闭遮罩层
     * @param {Object} e eventObject
     */
    public closeMask(e) {
        this.selection.closeMask(e);
    }


    // 跳转到详情
    public toDetail(e) {
        const businessId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `${pagePath.opportunity}?id=${businessId}`
        });
    }
    /**
     * 添加列表数据
     * @param {boolean} isReset 是否重置数据列表
     * @param {boolean} isRefresh 是否来自下拉刷新
     * @returns 
     */
    private addListItem(isReset = false, isRefresh = false) {
        toast.showLoading('', true);
        // 如果是刷新重置部分请求配置
        if (isReset) {
            this.data.pageNo = 0;
            this.data.listCount = 0;
            this.data.businessList = [];
        }
        // 页数自增
        this.data.pageNo++;
        // 发送请求
        return this.requestList({})
            .then((res: any) => {
                // 状态码检查
                if (resCodeCheck(res)) {
                    return;
                }
                const dataLength = res.data.length;
                if (dataLength === 0) {
                    toast.showWarning('没有更多数据了');
                    // 如果是重置 则清空所有数据
                    if (isReset) {
                        wx.stopPullDownRefresh();
                        this.setData({
                            businessTotal: 0,
                            businessList: []
                        });
                    }
                    return;
                }
                // console.log(res.data);

                // 时间字段处理 
                res.data.map(item => {
                    item.time = listTimeFormat(item.CreateTime);
                    return item;
                });

                // 将新数据拼接到 businessList 数组上
                this.data.businessList.push(...res.data);

                const delay = isRefresh ? refreshDelay : 0;

                // 总计数增加
                this.data.listCount += dataLength;

                // 如果是刷新，停止刷新动画
                setTimeout(() => {
                    this.setData({
                        loaded: true,
                        businessTotal: res.total,
                        businessList: this.data.businessList
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
     * 请求列表数据
     * @param {any} {
     *     ticket = this.data.ticket,
     *     pageSize = this.data.pageSize,
     *     pageNo = this.data.pageNo
     *   } 
     * @returns 
     */
    private requestList({
        pageSize = this.data.pageSize,
        pageNo = this.data.pageNo,
        orderBy = this.data.orderBy,
        PreFrom = this.data.PreFrom,
        Status = this.data.Status
    }) {
        const ticket = wx.getStorageSync('ticket');
        // 发送请求
        return request({
            url: `${domain}/APIOpportunityPre/Read`,
            data: {
                ticket,
                pageSize,
                pageNo,
                orderBy,
                PreFrom,
                Status
            }
        });
    }


    /**
     * 生命周期相关
     */
    private onLoad(options) {
        // _selection 初始化
        this.selection.init();

        // 获取 search 入口组件高度
        let p1 = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-search').boundingClientRect(rect => {
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
    private onReady() {

    }
    private onShow() {

    }
    private onHide() {

    }
    private onUnload() { }
    private onPullDownRefresh(e) {
        // 下拉刷新
        this.addListItem(true, true);
    }
    private onReachBottom() {
        // 上拉加载
        this.addListItem();
    }
    private onShareAppMessage() { }
}

Page(new BusinessPage());
// Page(new BasePage());