import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck } from '../../../../modules/auth';
import { enumConfig } from '../../../../config/enum.config';
import { enumToOptions } from '../../../../modules/util';
import pagePath from '../../../../config/path.config';


interface Data {
    loaded: boolean,
    // 微信信息
    wechatInfo?: {
        avatar: string,
        username: string
    },
    // 建档信息
    recordInfo?: {
        Name: string,
        Sex: number,
        MobilePhone: string
    },

    // 枚举
    SexOptions: any[]

}

class RecordEditPage extends BasePage {
    /**
     * 是否来自业务详情
     * 默认值为 false(来自待建档列表-线索详情)
     * 表单提交时，该值为 false 返回 2 层(到建档列表)
     * 该值若为 true 则返回1层(到业务详情)
     */
    private isFromOp: boolean = false;
    private id: number = 0;
    public data: Data = {
        loaded: false,
        SexOptions: enumToOptions(enumConfig.Sex)
    }
    private loadData() {
        toast.showLoading('');
        request({
            url: domain + '/ApiCustomerPre/ReadCustomerClue',
            data: {
                ticket: wx.getStorageSync('ticket'),
                id: this.id
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) {
                return;
            }
            const data = res.data;

            // 顶部客户微信基本信息
            this.data.wechatInfo = {
                avatar: data.HeadImgUrl,
                username: data.Nickname
            }

            // 建档信息 默认值
            this.data.recordInfo = {
                Name: data.Name,
                Sex: data.Sex,
                MobilePhone: data.MobilePhone
            }

            toast.hide();
            this.setData({
                loaded: true,
                wechatInfo: this.data.wechatInfo,
                recordInfo: this.data.recordInfo
            });
        });
    }
    private onLoad(options) {
        const { id, fromOp } = options;
        this.id = ~~id;
        this.isFromOp = !!fromOp; // 是否来自业务详情
        this.loadData();
    }

    /**
     * 设置性别
     * @param e 
     */
    public setSex(e) {
        const index = e.detail.value;
        // 拿到对应 key
        const key = this.data.SexOptions[index].key;
        this.data.recordInfo.Sex = key;
        this.setData({
            recordInfo: this.data.recordInfo
        });
    }
    /**
     * 输入框输入事件
     * @param e 
     */
    public syncInput(e) {
        const name = e.target.dataset.name,
            val = e.detail.value;
        this.data.recordInfo[name] = val;
        console.log(this.data.recordInfo);
    }
    /**
     * 提交保存建档
     */
    public saveRecord(e) {
        // 表单验证
        const formData = this.data.recordInfo;
        if (/^\s*$/.test(formData.MobilePhone) || /^\s*$/.test(formData.Name)) {
            toast.showWarning('请完整填写表单');
            return;
        }
        if (!(/^1[34578]\d{9}$/.test(formData.MobilePhone))) {
            toast.showWarning('请输入11位有效手机号码');
            return;
        }
        toast.showLoading('', true);
        // 发送请求
        const data = {
            ticket: wx.getStorageSync('ticket'),
            id: this.id,
            Name: formData.Name,
            MobilePhone: formData.MobilePhone,
            Sex: formData.Sex
        }
        request({
            url: domain + '/UC/CustomerPre/CreateForRecord',
            data: data
        }).then(res => {
            if (resCodeCheck(res)) {
                return;
            }
            toast.showSuccess('提交成功', 2000, true);
            setTimeout(() => {
                const pages = getCurrentPages();
                /**
                 * 判断是否来自业务详情
                 * 若来自业务详情，直接返回一层，不需要触发父级刷新
                 * 若来自常规入口(线索详情)，则返回两层至待建档客户列表，并触发父级刷新
                 */
                if (this.isFromOp) {
                    wx.navigateBack();
                } else {
                    // 修改 record-list 待建档客户列表页的属性，并返回列表
                    pages[pages.length - 3].goToCustomer = this.id;
                    // 返回父页面执行 重定向
                    wx.navigateBack({
                        delta: 2
                    });
                }
            }, 2000);
        });
    }
}

Page(new RecordEditPage());