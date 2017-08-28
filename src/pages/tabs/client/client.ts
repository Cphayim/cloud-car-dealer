import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Selection from '../../../components/selection/selection';
import toast from '../../../modules/toast';
import { domain } from '../../../config/url.config';
import { openSearch } from '../../../components/search/search';
import { request } from '../../../modules/request';
import { enumConfig } from '../../../config/enum.config';

/*
 * Tab 客户页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:17 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 15:10:47
 */


// 实例化 Selection 组件类
const selectionDataJSON = `[{"name":"orderby","title":"排列","type":"select","opts":[{"title":"绑定顾问时间","val":"0"},{"title":"关注时间","val":"1"},{"title":"最近活跃时间","val":"2"}]},{"name":"channel","title":"沟通渠道","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"电话","val":"20"},{"title":"微信","val":"30"}]},{"name":"level","title":"等级","type":"all","opts":[{"title":"全部","val":"all"},{"title":"H","val":"h"},{"title":"A","val":"a"},{"title":"B","val":"b"},{"title":"C","val":"c"}]},{"name":"carModel","title":"车系","type":"screening","opts":[{"title":"一类车","val":"10"},{"title":"二类车","val":"20"},{"title":"三类车","val":"30"}]},{"name":"binding","title":"绑定时间","type":"all","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]},{"name":"pretime","title":"最近联系时间","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]}]`;
const selection = new Selection({
    selectionData: JSON.parse(selectionDataJSON)
});

class ClientPage extends BasePage {
    private selection: Selection = selection;

    // 视图滚动属性
    private listPaddingTop: number = 0;
    private selectionHeight: number = 0;
    private searchHeight: number = 0;


    private data: any = {
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
        this.selection.chooseOption(e);
        /**
         * 这里进行对客户列表的操作
         * ......
         */
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
        this.selection.chooseScreeningOption(e);
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
        this.selection.resetQuery();
    }
    /**
     * 添加列表数据
     * @param {boolean} isReset 是否重置数据列表
     * @param {boolean} isRefresh 是否来自下拉刷新
     * @returns 
     */
    private addListItem(isReset = false, isRefresh = false){
        let msg = isRefresh ? '正在刷新' : '正在加载';
        toast.showLoading(msg, true);
        // 如果是刷新重置部分请求配置
        if (isReset) {
            this.data.pageNo = 0;
            this.data.listCount = 0;
            this.data.clientList = [];
        }
        // 页数自增
        this.data.pageNo++;
        return this.requestList({});
    }

    private requestList({
        
    }){

    }
    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        // 页面加载时调用 selection 的 init 方法初始化组件
        this.selection.init();

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

    private onReady() {
    }
    private onShow() { }
    private onHide() { }
    private onUnload() { }
    private onPullDownRefresh() { }
    private onReachBottom() { }
    private onShareAppMessage() { }
}

Page(new ClientPage());