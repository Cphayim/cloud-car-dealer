/* 本月统计(新增潜客/交车/战败)
 * @Author: Cphayim 
 * @Date: 2017-08-17 14:03:34 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-29 16:54:33
 */
import BasePage from '../../basepage';
import toast from '../../../modules/toast';
import { dateFormat, getFirstAndLastMonthDay, listTimeFormat } from '../../../modules/util';
import { request } from '../../../modules/request';
import { domain } from '../../../config/url.config';
import { enumConfig } from '../../../config/enum.config';
import { resCodeCheck } from '../../../modules/auth';
import pagePath from '../../../config/path.config';

interface Data {
    loaded: boolean;
    listData: any[];
    CustomerPreFrom: any;
    type: number;
}

class Monthly extends BasePage {
    // 页面类型判断 type: 1->新增 2->交车 3->战败
    private type: number = 0;
    private reqPath: string = '';
    private reqData: any = {};

    public data: Data = {
        loaded: false,
        listData: [],
        CustomerPreFrom: enumConfig.CustomerPreFrom,
        type: 0
    }
    private onLoad(options) {
        this.type = ~~options.type;
        // 判断类型 type: 1->新增 2->交车 3->战败
        if (this.type === 1) {
            wx.setNavigationBarTitle({
                title: '本月新增潜客'
            });
            this.reqPath = '/ApiCustomerPre/ReadForSearchView';
            this.reqData.CustomerPreType = 1;
            this.reqData.PreLevelStr = '0,1,2,3,4,5,7';

            // 获取当月第一天和最后一天
            // 接口不一样，这里参数名不同
            const { firstdate: BeginTime, lastdate: EndTime } = getFirstAndLastMonthDay();
            this.reqData.BeginTime = BeginTime;
            this.reqData.EndTime = EndTime;
            this.reqData.pageSize = 500;
        } else if (this.type === 2) {
            wx.setNavigationBarTitle({
                title: '本月交车'
            });
            this.reqPath = '/UC/CustomerVisit/Read';
            this.reqData.VisitType = '3';
            this.reqData.ItemType = '6';
            this.reqData.Status = '1';
            // 接口不一样，这里参数名不同
            const { firstdate: BeginDate, lastdate: EndDate } = getFirstAndLastMonthDay();
            this.reqData.BeginDate = BeginDate;
            this.reqData.EndDate = EndDate;
            this.reqData.pageSize = 500;

        } else if (this.type === 3) {
            wx.setNavigationBarTitle({
                title: '本月战败'
            });
            this.reqPath = '/UC/CustomerLose/ReadForAudit';
            // 流失状态（本月战败包含状态为审核通过和不用审批两种状态）
            this.reqData.StatusStr = '1,10';

            // 接口不一样，这里参数名不同
            const { firstdate: BeginDate, lastdate: EndDate } = getFirstAndLastMonthDay();
            this.reqData.BeginDate = BeginDate;
            this.reqData.EndDate = EndDate;
            this.reqData.pageSize = 500;
        } else {
            toast.showError('类型参数有误！');
            return;
        }


        this.loadData();
    }
    /**
     * 加载数据
     */
    private loadData() {
        toast.showLoading('正在加载...');
        this.requestData()
            .then((res: any) => {
                const data = res.data;
                // 检测错误
                if (resCodeCheck(res)) return;
                console.log(res.data);


                // 根据 type判断数据中时间字段名
                let timeFieldName: string = '';
                if (this.type === 1) {
                    // 绑定顾问时间
                    timeFieldName = 'BindEmployeeTime';
                } else if (this.type === 2) {
                    timeFieldName = 'NextTime';
                }
                else if (this.type === 3) {
                    // 审核时间
                    timeFieldName = 'AuditTime';
                }

                // 时间显示格式处理
                if (timeFieldName) {
                    data.forEach(item => {

                        item.time = listTimeFormat(item[timeFieldName]);
                        return item;
                    });
                }

                this.setData({
                    type: this.type,
                    listData: data,
                    loaded: true
                });
                toast.hide();
            });
    }
    /**
     * 发送请求
     */
    private requestData() {
        this.reqData.ticket = wx.getStorageSync('ticket');
        console.log(this.reqData);
        return request({
            url: domain + this.reqPath,
            data: this.reqData
        });
    }
    private itemToEnter(e) {
        const id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: `${pagePath.customer}?id=${id}`
        });
    }
    constructor() {
        super();
    }
}

Page(new Monthly());