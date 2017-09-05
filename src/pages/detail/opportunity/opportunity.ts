import {modal} from '../../../modules/modal';
import pagePath from '../../../config/path.config';
import toast from '../../../modules/toast';
import { domain } from '../../../config/url.config';
import { enumConfig } from '../../../config/enum.config';
import { request } from '../../../modules/request';
import BasePage from '../../basepage';
import { resCodeCheck } from '../../../modules/auth';
/*
 * 业务详情逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-20 16:58:49 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-28 18:09:38
 */

class OpportunityPage extends BasePage {
    progressChangeData: {
        ticket: any;
        status: any;
        ids: any;
        name: any;
        mobilePhone: any;
        isRecord: boolean;
    };
    public data: any = {
        loaded: false, // 页面是否加载完毕，控制动画显示

        // 底部建档信息确认模态框
        modal1: {
            isShowModal: false, // 是否显示
            isLock: false, // 是否正在执行逻辑
            modalType: 1, // 类型
            modalTip: '',
        },
        modal2: {
            isShowModal: false, // 是否显示
            isLock: false, // 是否正在执行逻辑
            textareaVal: '', // 输入域文本
        },

        // 数据对象，需要将请求得到的返回数据处理之后再添加
        pageData: {
            userInfo: {},
            list: {},
            isShow: true, // 是否显示按钮组
            btn: {

            },
            tip: {

            }
        },

        /**
         * 请求相关
         */
        Id: 0, //页面 url 解析的参数id，用于请求页面数据
        customerId: 0, // 客户 id
        completeData: {}, // 完整数据

        /**
         * 枚举相关
         */
        enumName: 'Opportunity',
        enumConfig: enumConfig,
    }
    constructor() {
        super();
    }
    /**
     * 加载数据
     */
    private loadData(isRefresh = false) {
        toast.showLoading(isRefresh ? '正在刷新...' : '正在加载...', true);
        // 发送请求
        this.requestData().then((res: any) => {
            console.log(res.data);
            // 错误状态检测
            if (resCodeCheck(res)) return;

            const data = res.data;


            // 存一份完整数据
            this.setData({
                completeData: data
            });

            /**
             * 组装页面数据
             */

            const pageData = this.data.pageData;
            const {
                    userInfo,
                list
                } = pageData;

            // 枚举属性
            const enumName = this.data.enumName;
            const enumConfig = this.data.enumConfig;
            // intro 组件数据
            userInfo.avatar = data.HeadImgUrl;
            userInfo.realname = data.CustomerName;
            userInfo.username = data.NickName;
            userInfo.source = data.CustomerPreFrom;
            userInfo.time = data.BecomeTime;
            userInfo.phone = data.MobilePhone;
            userInfo.customerId = data.CustomerId;

            // list 组件数据
            list.title = '业务详情';
            list.items = [];

            list.items.push({
                key: '当前状态',
                val: enumConfig[enumName + 'PreStatus'][data.Status]
            });
            // 如果 业务类型为 新车 或 售前咨询
            if (data.PreFrom == 4 || data.PreFrom == 8) {
                list.items.push({
                    key: '意向车型',
                    val: data.CarString1
                });
            }
            list.items.push({
                key: '销售顾问',
                val: data.EmployeeName
            });
            list.items.push({
                key: '业务类型',
                val: enumConfig[enumName + 'PreFrom'][data.PreFrom]
            });
            if (data.PreFrom != 3) {
                if (data.PreFrom == 1) {
                    list.items.push({
                        key: '预约车型',
                        val: data.FromTitle
                    });
                } else if (data.PreFrom == 2) {
                    list.items.push({
                        key: '询价车型',
                        val: data.FromTitle
                    });
                } else {
                    list.items.push({
                        key: '活动标题',
                        val: data.FromTitle
                    });
                }
            } else {
                list.items.push({
                    key: '原有车型',
                    val: data.OriginalCar
                });
                list.items.push({
                    key: '意向车型',
                    val: data.CarString2
                });
            }

            if (data.Appointment && data.PreFrom == 1) {
                list.items.push({
                    key: '试驾时间',
                    val: data.Appointment
                });
            }

            list.items.push({
                key: '提交时间',
                val: data.CreateTime
            });

            // 是否显示按钮组
            if (data.IsShow) {
                if (data.Status == 2) {
                    pageData.btn.name = '已联系';
                    pageData.btn.status = 9;
                } else if (data.Status == 9) {
                    pageData.btn.name = '已到店';
                    pageData.btn.status = 11;
                }
            } else {
                pageData.isShow = false;
                pageData.tip.msg = data.DealPrompt;
            }


            let delay = isRefresh ? 600 : 500;
            setTimeout(() => {
                this.setData({
                    pageData,
                    loaded: true
                });
                if (isRefresh) {
                    toast.showSuccess('刷新成功');
                    wx.stopPullDownRefresh();
                } else {
                    toast.hide();
                }
            }, delay);
        }).catch(err => {
            console.log(err);
            toast.showError('网络请求失败', 2000);
        });
    }
    /**
     * 请求页面数据
     */
    private requestData() {
        const {
            Id
        } = this.data;
        const ticket = wx.getStorageSync('ticket');
        return request({
            url: `${domain}/APIOpportunityPre/XCXDetail`,
            data: {
                ticket,
                Id
            }
        });
    }

    /**
     * 标记无效按钮点击事件
     */
    public flagInvalid(e) {
        const completeData = this.data.completeData;
        // 确认框
        modal.show({
            content: '确认标记无效？'
        }).then((res: any) => {
            // 点击取消，退出
            if (res.cancel) {
                return;
            }

            const status = 'Invalid';
            // 发送请求标记无效
            request({
                url: `${domain}/Biz/OpportunityPre/Status`,
                data: {
                    ticket: wx.getStorageSync('ticket'),
                    ids: completeData.Id,
                    status
                }
            }).then((res: any) => {
                // 检测错误
                if (resCodeCheck(res)) return;

                // 操作成功
                // 重新加载数据
                this.loadData(true);

            }).catch(err => {
                toast.showError('网络请求失败');
                console.log(err);
            });
        })
    }
    /**
     * 状态更变按钮点击事件
     */
    public changeStatus(e) {
        const completeData = this.data.completeData;
        // 获取状态值
        let status = e.target.dataset.status;

        const statusConfig = {
            9: 'Finish',
            11: 'ToShop'
        }

        // 设置 progressChange 请求 的默认数据
        this.progressChangeData = {
            ticket: wx.getStorageSync('ticket'),
            status: statusConfig[status],
            ids: completeData.Id,
            name: completeData.CustomerName,
            mobilePhone: completeData.MobilePhone,
            isRecord: false
        }

        // 是否建档确认
        request({
            method: 'get', // ！这里居然是 get 
            url: `${domain}/UC/CustomerRecord/IsCustomerRecord`,
            data: {
                ticket: wx.getStorageSync('ticket'),
                CustomerId: completeData.CustomerId,
            }
        }).then((res: any) => {
            console.log(res);
            // 错误检查
            if (resCodeCheck(res)) return;

            let type = res.data;
            console.log(type);
            if (type == 1 || type == 2) {
                // 未建档 (1) 或客户资料有误 (2)
                // 设置模态框数据
                this.data.modal1.isShowModal = true;
                this.data.modal1.modalType = res.data;
                // 打开模态框并显示内容
                this.setData({
                    modal1: this.data.modal1
                });
            } else {
                // 已建档，且客户资料无误
                // 直接操作
                this.progressChangeStatus();
            }
        }).catch(err => {
            toast.showError('网络请求失败');
            console.log(err);
        });
    }
    /**
     *  modal 表单提交(确定按钮)
     */
    private statusChangeFormSubmit(e) {
        console.log(this.data.modal1.isLock);

        // 防止连续提交
        if (this.data.modal1.isLock) return;
        // 提交锁
        this.data.modal1.isLock = true;

        // 是否有表单错误 
        let formErr = false;
        // 获取表单数据
        const formData: { Name: string, MobilePhone: string } = e.detail.value;
        const reg1 = /^[\u4e00-\u9fa5]{2,4}$/;
        const reg2 = /^0?1[34578]\d{9}$/;
        if (formData.Name == '') {
            toast.showWarning('姓名不能为空');
            formErr = true;
        } else if (!reg1.test(formData.Name)) {
            toast.showWarning('请输入合法姓名');
            formErr = true;
        } else if (formData.MobilePhone == '') {
            toast.showWarning('手机号不能为空');
            formErr = true;
        } else if (!reg2.test(formData.MobilePhone)) {
            toast.showWarning('请输入有效手机号');
            formErr = true;
        }

        // 如果有表单错误 解锁模态框 退出
        if (formErr) {
            this.data.modal1.isLock = false;
            return;
        }

        this.data.modal1.isShowModal = false;
        // 关闭模态框
        this.setData({
            modal1: this.data.modal1
        });
        this.progressChangeData.name = formData.Name;
        this.progressChangeData.mobilePhone = formData.MobilePhone;
        this.progressChangeStatus();
    }
    /**
     * 修改状态继续操作
     * @private
     * @memberof OpportunityPage
     */
    private progressChangeStatus() {
        toast.showLoading('正在提交...', true);
        request({
            url: `${domain}/Biz/OpportunityPre/Status`,
            data: this.progressChangeData,
        }).then((res) => {
            if (resCodeCheck(res)) return;
            // 刷新数据
            this.loadData(true);
            this.data.modal1.isLock = false;
        }).catch(err => {
            console.log(err);
            toast.showError('网络请求失败');
            this.data.modal1.isLock = false;
        });
    }
    public showModal2(e) {
        this.data.modal2.isShowModal = true;
        this.setData({
            modal2: this.data.modal2
        });
    }
    /**
     * modal 取消按钮事件
     */
    public modalCancel(e) {
        let id = e.target.dataset.modal;
        if (id == 1) {
            this.data.modal1.isShowModal = false;
            this.data.modal1.isLock = false;
            this.setData({
                modal1: this.data.modal1
            });
        } else if (id == 2) {
            this.data.modal2.isShowModal = false;
            this.data.modal2.isLock = false;
            this.setData({
                modal2: this.data.modal2
            });
        }

    }
    /**
     * 提交备注
     */
    private remarkSubmit(e) {
        const Remark = e.detail.value.Remark;
        if (!Remark) {
            toast.showWarning('无法提交空的备注');
            return;
        }
        toast.showLoading('正在提交...', true);
        request({
            url: `${domain}/UC/CustomerAfter/Remark`,
            data: {
                ticket: wx.getStorageSync('ticket'),
                Id: this.data.completeData.CustomerId,
                type: 1117,
                Remark: Remark
            }
        }).then((res) => {
            if (resCodeCheck(res)) return;

            // 关闭模态框 清空 text.area
            this.data.modal2.isShowModal = false;
            this.data.modal2.textareaVal = '';
            this.setData({
                modal2: this.data.modal2
            });

            toast.showSuccess('添加备注成功');
            
        }).catch(err => {
            console.log(err);
            toast.showError('网络请求失败');
        });
    }
    /**
     * 拨打电话 
     */
    public callPhone(e) {
        const phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    }
    /**
     * 生命周期
     */
    private onLoad(options) {
        wx.setNavigationBarTitle({
            title: '报名详情'
        });
        // 获取请求 id
        this.data.Id = options.id;

        // 加载数据
        this.loadData();
    }
    private onReady() {
        wx.createSelectorQuery().select('.m-operation').boundingClientRect(res => {
            if (!res) return;
            this.setData({
                paddingLayerHeight: res.height
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
        // 下拉刷新
        this.loadData(true);
    }
    private onReachBottom() {

    }
    private onShareAppMessage() {

    }
}

Page(new OpportunityPage());