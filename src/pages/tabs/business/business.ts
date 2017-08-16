import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Selection from '../../../components/selection/selection';
import toast from '../../../modules/toast';
import { dateFormat } from '../../../modules/util';
import { domain } from '../../../config/url.config';
import { enumConfig } from '../../../config/enum.config.js';
import { openSearch } from '../../../components/search/search';
import { request } from '../../../modules/request';
import { resCodeCheck } from '../../../modules/auth';


/*
 * Tab 业务页逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-03 10:45:33 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 15:28:12
 */


// 枚举头
const enumName = 'Opportunity';

const selectionJSON = `[{ "name": "PreFrom", "title": "类型", "type": "select", "opts": [{ "title": "全部", "val": "" }, { "title": "试驾预约", "val": "1" }, { "title": "购车询价", "val": "2" }, { "title": "二手置换", "val": "3" }, { "title": "新车", "val": "4" }, { "title": "二手车", "val": "5" }, { "title": "购车优惠", "val": "7" }, { "title": "销售咨询", "val": "8" }] }, { "name": "PreStatus", "title": "状态", "type": "select", "opts": [{ "title": "全部", "val": "" }, { "title": "未联系", "val": "2" }, { "title": "已联系", "val": "9" }, { "title": "已到店", "val": "11" }, { "title": "无效", "val": "10" }] }]`;

// 实例化 selection 组件对象
const selection = new Selection({
    isExistScreening: false, // 不存在 Screening-box
    selectionData: JSON.parse(selectionJSON) // 数据
});

class BusinessPage extends BasePage {
    private selection = selection;
    public data: any = {
        pagePath: pagePath,
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
        enumName: enumName,
        enumConfig: enumConfig,

        /**
         * 数据
         */
        businessTotal: 0, // 业务总数
        businessList: [], // 业务列表
    }
    constructor() {
        super();
        this.data.selection = selection;
    }
    /**
     * 搜索框 tap 事件
     * @param {any} e 
     * @memberof BusinessPage
     */
    public openSearch(e) {
        openSearch(e);
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
        const businessId = e.currentTarget.dataset.businessId;
        wx.navigateTo({
            url: `${pagePath.opportunity}?businessId=${businessId}`
        });
    }
    /**
     * 添加列表数据(追加到原businessList中)
     * @param {boolean} isReset 是否重置数据列表
     * @returns 
     */
    private addListItem(isReset = false, isRefresh = false) {
        let msg = isRefresh ? '正在刷新' : '正在加载';
        toast.showLoading(msg, true);
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

                // 获取当前时间
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;
                const currentDay = currentDate.getDate();

                // 时间字段处理 
                res.data.map(item => {
                    const date = new Date(item.CreateTime);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    // 如果是今天显示时间
                    if (year === currentYear && month === currentMonth && day === currentDay) {
                        item.Time = dateFormat('hh:mm', new Date(item.CreateTime));
                    }
                    // 否则显示日期
                    // 当月
                    else if (year === currentYear && month === currentMonth) {
                        let dis = currentDay - day;
                        // 昨天
                        if (dis === 1) {
                            item.Time = dateFormat('昨天', new Date(item.CreateTime));
                        }
                        // 前天
                        else if (dis === 2) {
                            item.Time = dateFormat('前天', new Date(item.CreateTime));
                        } else {
                            item.Time = dateFormat('MM-dd', new Date(item.CreateTime));
                        }
                    }
                    // 同年
                    else if (year === currentYear) {
                        item.Time = dateFormat('MM-dd', new Date(item.CreateTime));
                    }
                    // 其它
                    else {
                        item.Time = dateFormat('yyyy-MM-dd', new Date(item.CreateTime));
                    }
                    return item;
                });

                // 将新数据拼接到 businessList 数组上
                this.data.businessList.push(...res.data);

                this.setData({
                    businessTotal: res.total,
                    businessList: this.data.businessList
                });
                // 总计数增加
                this.data.listCount += dataLength;

                // 如果是刷新，停止刷新动画
                if (isRefresh) {
                    setTimeout(() => {
                        toast.showSuccess('刷新成功');
                        wx.stopPullDownRefresh();
                    }, 600);
                } else {
                    toast.hide();
                }
            })
            .catch(err => {
                toast.showError('网络请求失败');
                if (isRefresh) {
                    wx.stopPullDownRefresh();
                }
                console.log(err);
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
    private onPullDownRefresh() {
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