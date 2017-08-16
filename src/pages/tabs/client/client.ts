import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Selection from '../../../components/selection/selection';
import toast from '../../../modules/toast';
import { domain } from '../../../config/url.config';
import { openSearch } from '../../../components/search/search';
import { request } from '../../../modules/request';

/*
 * Tab 客户页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:17 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 10:13:05
 */

// 测试数据
const clientData = [];

const levelArr = ['H', 'A', 'B', 'C'];
for (let i = 0; i < levelArr.length; i++) {
    const listObj: any = {};
    const clientList = [];
    listObj.level = levelArr[i];
    listObj.clientList = clientList;
    for (let j = 0; j < 10; j++) {
        const clientObj: any = {}
        clientObj.realname = clientObj.username = `第${j + 1}位${levelArr[i]}级客户`;
        clientObj.signature = `客户签名`.repeat(j + 1);
        clientObj.avatarUrl = 'https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg';
        clientObj.id = ~~(Math.random() * 10000);
        clientObj.time = '19:30';
        clientList.push(clientObj);
    }
    clientData.push(listObj);
}

// 实例化 Selection 组件类
const selectionDataJSON = `[{"name":"orderby","title":"排列","type":"select","opts":[{"title":"绑定顾问时间","val":"0"},{"title":"关注时间","val":"1"},{"title":"最近活跃时间","val":"2"}]},{"name":"channel","title":"沟通渠道","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"电话","val":"20"},{"title":"微信","val":"30"}]},{"name":"level","title":"等级","type":"all","opts":[{"title":"全部","val":"all"},{"title":"H","val":"h"},{"title":"A","val":"a"},{"title":"B","val":"b"},{"title":"C","val":"c"}]},{"name":"carModel","title":"车系","type":"screening","opts":[{"title":"一类车","val":"10"},{"title":"二类车","val":"20"},{"title":"三类车","val":"30"}]},{"name":"binding","title":"绑定时间","type":"all","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]},{"name":"pretime","title":"最近联系时间","type":"screening","opts":[{"title":"全部","val":"10"},{"title":"今天","val":"20"},{"title":"昨天","val":"30"},{"title":"近7日","val":"40"},{"title":"本月","val":"50"}]}]`;
const selection = new Selection({
    selectionData: JSON.parse(selectionDataJSON)
});

class ClientPage extends BasePage {
    private selection = selection;
    private sideTimer: number = 0; // 侧栏导航显示计时器
    private data: any = {
        pagePath,
        // 客户列表滚动区 scrollView 高度
        clientScrollViewHeight: 0, // 页面首次渲染时更新
        // selection 对象挂载
        // 客户列表数据
        clientData: clientData,
        // 侧边控制导航属性
        // 客户列表是否正在滚动，滚动时显示侧边导航
        scrolling: false,
    }
    // 搜索组件 入口方法挂载
    public openSearch = openSearch;
    constructor() {
        super();
        this.data.selection = selection;
    }
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
     * 客户列表滚动事件
     */
    public clientListScroll(e) {
        // 清空计时器
        clearTimeout(this.sideTimer);
        this.sideTimer = 0;
        this.setData({
            scrolling: true
        });
        // 设置延迟
        this.sideTimer = setTimeout(() => {
            this.setData({
                scrolling: false
            });
        }, 2000);
    }
    /**
     * 滚动到指定的列表(等级)
     */
    public scrollToList(e) {
        console.log(e);
        let id = e.target.dataset.levelId || '';
        console.log(id);
        this.setData({
            scrollToId: id
        });
        console.log(this.data.scrollToId);
    }

    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        request({
            url:`${domain}/UC/CustomerPre/ReadForSearch`,
            data:{
                ticket: '0c939c84-754d-4e9f-93cc-61ccece08d9d',
                PageSize:20,
                PageNo: 2
            }
        }).then(res=>{
            console.log(res);
        }).catch(err=>console.log(err));
        // 页面加载时调用 selection 的 init 方法初始化组件
        this.selection.init();
    }

    /**
     * 监听页面初次渲染完成
     */
    private onReady() {
        // 更新 m-client 的 scrollView 容器高度
        // 拿到 .m-client-scroll-view 距离视口顶部的高度
        wx.createSelectorQuery().select('.m-client-scroll-view')
            // 查询字段
            .fields({
                size: true, // 元素大小
                rect: true // 元素位置
            }, (res) => {
                this.setData({
                    clientScrollViewHeight: wx.getSystemInfoSync().windowHeight - res.top
                });
            }).exec();
    }
    private onShow() {

    }
    private onHide() {

    }
    private onUnload() {

    }
    private onPullDownRefresh() {
    }
    private onReachBottom() {
    }
    private onShareAppMessage() {

    }
}

Page(new ClientPage());