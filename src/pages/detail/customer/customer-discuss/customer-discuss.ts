import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth';
import { dateFormat } from '../../../../modules/util';

class CustomerDiscussPage extends BasePage {
    private type: number = 0;
    private id: number = 0;
    // visit 使用
    private Status: number = 0; // 状态 0:回访 1:邀约 2:到店
    // tostore 使用
    private VisitType: number = 2; // 2 到店
    private ItemType: number = 0; // 5 试驾 4 活动 3 其它
    private StoreDate: string = dateFormat('yyyy/MM/dd', new Date());
    // 通用
    private Remark: string = '';

    public data: any = {
        loaded: false,
        tplTpe: 0,
        StoreDate: dateFormat('yyyy/MM/dd', new Date()),
        ItemTypeOptions: ['试驾', '活动', '其它'],
        ItemTypeIndex: 0,
        isFirst: true,
    }
    private onLoad(options) {
        toast.showLoading();
        let title: string = '';
        this.id = ~~options.id;
        // 类型判断，没有匹配则退出
        switch (options.type) {
            case 'visit':
                this.data.tplType = this.type = 1;
                this.Status = options.status || 0;
                title = '添加跟进记录';
                break;
            case 'tostore':
                this.data.tplType = this.type = 2;
                this.StoreDate = options.storeDate || this.StoreDate;
                if (options.itemType == 4) { // 活动 4
                    this.data.ItemTypeIndex = 1; // ItemTypeOptions 下标
                } else if (options.itemType == 3) { // 其它 3
                    this.data.ItemTypeIndex = 2;
                } else { // 试驾 5
                    this.data.ItemTypeIndex = 0;
                }
                const isFirst = !!~~options.first;
                title = isFirst ? '计划到店' : '修改到店时间';
                this.setData({
                    isFirst: isFirst,
                    ItemTypeIndex: this.data.ItemTypeIndex,
                    StoreDate: this.StoreDate
                });
                break;
            case 'remark':
                this.data.tplType = this.type = 3;
                title = '添加备注信息';
                break;
            default:
                toast.showError('参数错误');
                setTimeout(() => {
                    wx.navigateBack();
                }, 2000);
                return;
        }
        this.setData({ tplType: this.data.tplType });
        wx.setNavigationBarTitle({ title });
        toast.hide();
        setTimeout(() => {
            this.setData({ loaded: true });
        }, 300);
    }

    /**
     * 同步 Input
     * @param {any} e 
     * @memberof CustomerDiscussPage
     */
    public changeInput(e) {
        const name: string = e.currentTarget.dataset.name,
            val = e.detail.value;
        this[name] = val;
    }

    /**
     * 改变到店目的(类型)
     * @param {any} e 
     * @memberof CustomerDiscussPage
     */
    public changeStoreType(e) {
        const index: number = ~~e.detail.value;
        this.data.ItemTypeIndex = index;
        this.setData({ ItemTypeIndex: this.data.ItemTypeIndex });
    }

    /**
     * 日期组件统一处理函数
     * 改变日期
     * @param e 
     */
    public changeDate(e) {
        // 获得 当前 picker 控件对应 name
        const name: string = e.currentTarget.dataset.name;
        // 获得日期值，正则替换
        const val: string = e.detail.value.replace(/-/g, '/');

        this[name] = val;
        this.setData({
            StoreDate: this.StoreDate,
        });
    }
    /**
     * 提交
     * @returns 
     * @memberof CustomerDiscussPage
     */
    public save() {
        switch (this.type) {
            case 1: // 已回访、邀约、到店，提交跟进
                if (/^\s*$/.test(this.Remark)) {
                    toast.showWarning('请填写跟进记录'); return;
                }
                toast.showLoading('', true);
                request({
                    url: domain + '/UC/CustomerVisit/SetVisitStatus',
                    data: {
                        ticket: wx.getStorageSync('ticket'),
                        CustomerId: this.id,
                        Status: this.Status,
                        Remark: this.Remark
                    }
                }).then(res => {
                    this.saveSuccess(res);
                });
                break;
            case 2: // 计划到店/修改到店时间
                if (this.StoreDate < dateFormat('yyyy/MM/dd', new Date())) {
                    toast.showWarning('计划日期不能小于当前日期'); return;
                }
                if (this.data.ItemTypeIndex === 1) { // 活动
                    this.ItemType = 4;
                } else if (this.data.ItemTypeIndex === 2) { // 其它
                    this.ItemType = 3;
                } else {
                    this.ItemType = 5; // 试驾
                }
                toast.showLoading('', true);
                const reqPath = this.data.isFirst ? '/UC/CustomerVisit/ModifyVisitStatus' : '/UC/CustomerVisit/ModifyStoreDate';
                request({
                    url: domain + reqPath,
                    data: {
                        ticket: wx.getStorageSync('ticket'),
                        CustomerId: this.id,
                        VisitType: this.VisitType,
                        VisitItem: this.ItemType,
                        NextTime: this.StoreDate,
                        StoreDate: this.StoreDate // 接口兼容处理
                    }
                }).then(res => {
                    this.saveSuccess(res);
                });
                break;
            case 3: // 添加备注信息
                if (/^\s*$/.test(this.Remark)) {
                    toast.showWarning('请填写备注信息'); return;
                }
                toast.showLoading('', true);
                request({
                    url: domain + '/UC/CustomerAfter/Remark',
                    data: {
                        ticket: wx.getStorageSync('ticket'),
                        id: this.id,
                        type: 1117, // 固定值
                        remark: this.Remark
                    }
                }).then(res => {
                    this.saveSuccess(res);
                });
                break;
        }
    }
    /**
     * 提交成功后处理逻辑
     * 弹层提示后，触发父刷新，返回
     * @private
     * @param {any} res 
     * @memberof CustomerDiscussPage
     */
    private saveSuccess(res) {
        if (resCodeCheck(res)) { return }
        toast.showSuccess('提交成功', 2000, true);
        const pages: any[] = getCurrentPages();
        pages[pages.length - 2].refreshFlag = true;
        setTimeout(() => {
            wx.navigateBack();
        }, 2000);
    }
}

Page(new CustomerDiscussPage());