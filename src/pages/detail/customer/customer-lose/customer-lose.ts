import BasePage from '../../../basepage';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import toast from '../../../../modules/toast';
import { resCodeCheck } from '../../../../modules/auth';
import { modal } from '../../../../modules/modal';

interface Data {
    loaded: boolean;
    tplType: number; // 模板号
    reason: boolean[]; // 战败原因开关
    reasonOptions: string[]; // 战败原因对应的显示字符串
}
class CustomerLosePage extends BasePage {
    private isLock: boolean = false;
    private type: number; // 模板序号 0:战败 1:拒访 2: 失联
    private id: number; // 客户id
    /**
     * 战败审核申请
     */
    private DefeatCarBrand: string = ''; // 战败品牌
    private DefeatReason: string = ''; // 战败原因 字符串拼接 A,B,C
    private Remark?: string = ''; // 战败说明
    private LoseType: number = 1; // 战败类型 1战败 2失联 3拒访


    public data: Data = {
        loaded: false,
        tplType: 0,
        reason: [false, false, false, false, false, false, false],
        reasonOptions: ['价格', '安全', '舒适', '动力', '经济', '其它'],
    }

    private onLoad(options) {
        this.id = ~~options.id;
        this.type = ~~options.type;
        this.setData({ tplType: this.type });
        let title = '';
        switch (this.type) {
            case 0: title = '申请战败审核'; break;
            case 1: title = '拒访登记'; break;
            case 2: title = '失联登记'; break;
        }
        wx.setNavigationBarTitle({ title: title });
        toast.showLoading();
        setTimeout(() => {
            toast.hide();
            this.setData({
                loaded: true
            });
        }, 300);
    }
    // 设置战败原因
    public setReason(e) {
        const target = e.target,
            index = target.dataset.index,
            optionName = target.dataset.optionName;
        if (index === undefined || optionName === undefined) return;
        // 取反
        this.data.reason[index] = !this.data.reason[index];
        this.setData({
            reason: this.data.reason
        });
    }

    /**
     * 输入框数据同步
     * @param {any} e 
     * @memberof CustomerLosePage
     */
    public changeInput(e) {
        const name = e.target.dataset.name,
            val = e.detail.value;
        this[name] = val || '';
    }
    /**
     * 提交
     * @param {any} e 
     * @memberof CustomerLosePage
     */
    public save(e) {
        if (this.isLock) { return }
        const data: any = {}
        if (this.type === 0) {
            // 战败审核申请
            if (!this.DefeatCarBrand || /^\s*$/.test(this.DefeatCarBrand)) {
                toast.showWarning('请填写战败品牌');
                return;
            }
            const DefeatReasonArr = [];
            this.data.reason.forEach((item, index) => {
                if (item) {
                    DefeatReasonArr.push(this.data.reasonOptions[index]);
                }
            })
            if (!DefeatReasonArr.length) {
                toast.showWarning('至少选择一个战败原因');
                return;
            }
            data.DefeatCarBrand = this.DefeatCarBrand;
            data.DefeatReason = DefeatReasonArr.join(',');
            data.LoseType = 1;
        } else if (this.type === 1 || this.type === 2) {
            data.LoseType = this.type === 1 ? 3 : 2;
        }

        data.Remark = this.Remark;
        data.ticket = wx.getStorageSync('ticket');
        data.CustomerId = this.id;
        data.Type = 10; // 记录表类型，固定值

        this.isLock = true;
        toast.showLoading();

        request({
            url: domain + '/UC/CustomerLose/Apply',
            data: data
        }).then(res => {
            if (resCodeCheck(res)) { return }
            this.isLock = false;
            toast.hide();
            modal.show({
                title: '',
                content: '提交成功',
                showCancel: false
            }).then(flag => {
                const pages = getCurrentPages();
                pages[pages.length - 2].refreshFlag = true;
                wx.navigateBack();
            });
        });
        setTimeout(() => {
            this.isLock = false;
        }, 3000);
    }
}

Page(new CustomerLosePage());