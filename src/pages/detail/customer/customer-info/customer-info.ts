import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import TabSlider from '../../../../components/tab-slider/tab-slider';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
/*
 * 客户详情 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 10:04:46 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 11:40:09
 */


// 测试数据
const pageData = {
    // 用户基本信息
    userInfo: {
        avatar: 'https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg',
        realname: 'Cphayim',
        username: 'Cphayim',
        source: '云程科技',
        time: '2017.07.20'
    },
    // 跟进信息
    follow: {
        head: {
            key: '跟进信息',
            val: '添加跟进记录',
            flag: 'follow'
        },
        items: [{
            key: '下次回访',
            val: '2017.07.31'
        },
        {
            key: '潜客等级',
            val: 'H'
        },
        ],
    },
    // 基本信息
    base: {
        head: {
            key: '基本信息',
            val: '编辑',
            flag: 'base'
        },
        items: [{
            key: '手机号',
            val: '110 119 120'
        },
        {
            key: '意向车型',
            val: '兰博基尼 LP-700'
        },
        {
            key: '对比车型',
            val: '兰博基尼 LP-700'
        },
        {
            key: '购车方式',
            val: '全款'
        },
        {
            key: '购车预算',
            val: '300万'
        }
        ]
    }
}

// 创建 tabSlider 对象
const tabSlider = new TabSlider({
    heightRatio: 0.5
});
class CustomerPage extends BasePage {
    private tabSlider = tabSlider;
    public data: any = {
        loaded: false,
        pageData,
        tabSlider,
    }
    /**
     * tabSlider 切换事件
     * @param {object} e 
     */
    changeSlider(e) {
        this.tabSlider.changeSlider(e);
    }
    /**
     * 列表头编辑按钮 tap 事件
     * @param {object} e 
     */
    headlinkListTap(e) {
        // 获取参数对象
        let paramObj:any = {};
        paramObj.flag = e.target.dataset.flag;

        // 遍历参数字符串
        let paramStr = '';
        let fisrt = true;
        for (let k in paramObj) {
            if (fisrt) {
                paramStr += `?${k}=${paramObj[k]}`;
                fisrt = false;
            } else {
                paramStr += `&${k}=${paramObj[k]}`;
            }
        }

        wx.navigateTo({
            url: pagePath['customer-edit'] + paramStr
        })
    }
    /**
     * 生命周期
     */
    onLoad(options) {
        toast.showLoading('加载中...', true);

        // 请求数据
        request({
            url: 'https://api.cphayim.me/',
            method: 'get'
        }).then(res => {
            // 同步数据的操作
            // ...
            const tabSliderData = [{
                // 渲染到 顶部 Tab
                tabTitle: '跟进记录',
                // 列表类型，决定了渲染出来的样式布局
                // 可选值 'text':文字列表、'graphic':图文列表、'tickt':票券列表
                listType: 'axis',
                // 列表项，视图层根据列表类型选择对应的模板渲染，多余的项会被忽略
                items: [{
                    id: 101,
                    date: '2017.07.31',
                    time: '16:45',
                    // 内容
                    content: '微信消息20条',
                },
                {
                    id: 102,
                    date: '2017.07.30',
                    time: '18:30',
                    content: '销售顾问 大坑货 更新等级 N->H'
                },
                {
                    id: 103,
                    date: '2017.07.30',
                    time: '18:20',
                    content: '销售顾问 大坑货 编辑客户手机号120 119 1110 -> 110 119 120'
                }
                ]
            }, {
                tabTitle: '客户轨迹',
                listType: 'axis',
                items: [{
                    id: 101,
                    date: '2017.07.31',
                    time: '16:45',
                    // 内容
                    content: '微信消息20条',
                },
                {
                    id: 102,
                    date: '2017.07.30',
                    time: '18:30',
                    content: '销售顾问 大坑货 更新等级 N->H'
                },
                {
                    id: 103,
                    date: '2017.07.30',
                    time: '18:20',
                    content: '销售顾问 大坑货 编辑客户手机号'
                }
                ]
            }];
            this.tabSlider.update(tabSliderData);


            setTimeout(() => {
                toast.hide();
                this.setData({
                    loaded: true
                });
            }, 300);
        }).catch(res => toast.showError('网络请求失败', 2000));
        wx.setNavigationBarTitle({
            title: 'Cphayim'
        });
    }
    onReady() {

    }
    onShow() {

    }
    onHide() {

    }
    onUnload() {

    }
    onPullDownRefresh() {

    }
    onReachBottom() {

    }
    onShareAppMessage() {

    }
}
Page(new CustomerPage());