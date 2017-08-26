import BasePage from '../../basepage';
import TabSlider from '../../../components/tab-slider/tab-slider';
import { request } from '../../../modules/request';
import { domain } from '../../../config/url.config';
import { dateFormat, listTimeFormat } from '../../../modules/util';
import { resCodeCheck } from '../../../modules/auth';
import toast from '../../../modules/toast';
/*
 * 任务页逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-11 15:49:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-24 22:18:48
 */

interface Data {
    loaded: boolean,
    tabSlider: TabSlider,
    type: number,
}

const tabSlider: TabSlider = new TabSlider({});

class TaskPage extends BasePage {
    private tabSlider: TabSlider = tabSlider;
    private title: string;
    private type: number = 0;
    private reqData: any = {};
    private reqPath: string;
    public data: Data = {
        loaded: false,
        tabSlider,
        type: this.type,

    }
    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        let { type, title } = options;
        // 获取类型 1: 回访任务 2: 邀约任务 3:到店任务 4:交车任务
        this.type = ~~type;
        this.title = decodeURI(title);
        // 修改标题
        wx.setNavigationBarTitle({ title: decodeURI(title) + '任务' });

        // 设置类型参数字段
        if (this.type === 1) {
            // 回访
            this.reqData.VisitType = '1';
            this.reqData.ItemType = '1';
        } else if (this.type == 2) {
            // 邀约
            this.reqData.VisitType = '1';
            this.reqData.ItemType = '2';
        } else if (this.type == 3) {
            // 到店
            this.reqData.VisitType = '2';
        } else if (this.type == 4) {
            // 交车
            this.reqData.VisitType = '3';
            this.reqData.ItemType = '6';
        }
        // 起始时间和结束时间都是今日

        this.reqData.BeginDate = dateFormat('yyyy-MM-dd 0:00:00', new Date());
        this.reqData.EndDate = dateFormat('yyyy-MM-dd 23:59:59', new Date());
        this.reqData.orderBy = 'Status asc,NextTime desc';
        this.reqData.pageNo = 1;
        this.reqData.pageSize = 500;

        this.reqPath = '/UC/CustomerVisit/Read';

        this.loadData();
    }
    /**
     * 加载数据
     */
    private loadData() {
        toast.showLoading('正在加载...');
        // 这里并发两次请求，当两次请求都成功返回时渲染数据
        Promise.all([this.requestData(0), this.requestData(1)])
            .then((resAll: any) => {
                // 两个请求中只要有一个出错，就 终止加载
                if (resCodeCheck(resAll[0]) || resCodeCheck(resAll[1])) return;
                // 获取两个列表的数据
                const [{ data: list1 }, { data: list2 }] = resAll;

                // 时间显示格式处理
                list1.forEach(item => {
                    item.time = listTimeFormat(item['NextTime']);
                    item.status = 0;
                    item.statusText = '未' + this.title;
                    return item;
                });
                list2.forEach(item => {
                    item.time = listTimeFormat(item['NextTime']);
                    item.status = 1;
                    item.statusText = '已' + this.title;
                    return item;
                });


                // 创建 tabslider 组件数据 
                const updateData = [{
                    tabTitle: '未' + this.title,
                    listType: 'client',
                    items: list1
                }, {
                    tabTitle: '已' + this.title,
                    listType: 'client',
                    items: list2
                }];
                this.tabSlider.update(updateData);
                this.setData({
                    loaded: true,
                    tabSlider: this.tabSlider
                });
                toast.hide();
            });
    }
    /**
     * 请求数据
     * @param status 状态 0: 待处理 1: 已处理 2: 取消
     */
    private requestData(status: number = 0) {
        this.reqData.ticket = wx.getStorageSync('ticket');
        // 深拷贝一份请求参数 防止并发请求时差太小，参数不准确
        const data: any = JSON.parse(JSON.stringify(this.reqData));
        data.Status = status;
        return request({
            url: domain + this.reqPath,
            data: data
        });
    }
    public changeSlider(e) {
        tabSlider.changeSlider(e);
    }
    private onReady() { }
}

Page(new TaskPage());
