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
    private submitLock: boolean = false;
    private id: number = 0;
    public data: Data = {
        loaded: false,
        SexOptions: enumToOptions(enumConfig.Sex)
    }
    private loadData() {
        toast.showLoading('正在加载...');
        request({
            url: domain + '/UC/CustomerPre/Detail',
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
        const id: number = ~~options.id;
        this.id = id;

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
        // 如果锁定状态，退出
        if (this.submitLock) {
            return;
        }
        // 表单验证
        const formData = this.data.recordInfo;
        if (!formData.MobilePhone || !formData.Name) {
            toast.showWarning('请完整填写表单');
            return;
        }
        // if (!(/^[\u4e00-\u9fa5]{2,4}$/.test(formData.Name))) {
        //     toast.showWarning('请输入2-4位中文姓名');
        //     return;
        // }
        if (!(/^1[34578]\d{9}$/.test(formData.MobilePhone))) {
            toast.showWarning('请输入11位有效手机号码');
            return;
        }
        // 锁定
        this.submitLock = true;
        toast.showLoading('正在提交...');
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
            this.submitLock = false;
            if (resCodeCheck(res)) {
                return;
            }
            toast.hide();

            const pages = getCurrentPages();

            // 修改 record-list 待建档客户列表页的属性，并返回列表
            pages[pages.length - 3].goToCustomer = this.id;
            // 返回父页面执行 重定向
            wx.navigateBack({
                delta: 2
            });
        });

        setTimeout(() => {
            this.submitLock = false;
        }, 2000);
    }
}

Page(new RecordEditPage());