import BasePage from '../../basepage';
import { request } from '../../../modules/request';
import { domain } from '../../../config/url.config';
import { resCodeCheck } from '../../../modules/auth';
import toast from '../../../modules/toast';
import pagePath from '../../../config/path.config';


interface Data {
    loaded: boolean,
    Name: string, // 客户名
    Balance: number,
    AmountStr: string,
}
class ChargePage extends BasePage {

    // 请求获取
    private id: number = 0; // 客户 id
    private rand: string = ''; // 优惠券码
    private Type: string = ''; // 消费类型
    private TenantId: string = ''; // 经销商 id
    private MemberNO: string = ''; // 会员卡号

    // 表单填写
    private Amount: number = 0; // 消费金额
    private Title: string = ''; // 消费项目
    private ShopOrderNO: string = ''; // 订单号
    private Remark: string = ''; // 备注


    public data: Data = {
        loaded: false,
        Name: '',
        Balance: 0,
        AmountStr: '0.00'
    }
    private onLoad(options) {
        const rand: string = options.rand;
        this.rand = rand;
        this.loadData();
    }
    private loadData() {
        request({
            url: domain + '/ApiRechargeConsumptionLog/ApiConsumption',
            data: {
                ticket: wx.getStorageSync('ticket'),
                randStr: this.rand
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) {
                return;
            }
            const data: any = res.data;

            this.data.Name = data.Name; // 客户名
            this.data.Balance = data.Balance.toFixed(2); // 剩余金额

            this.id = data.model.CustomerId; // 客户 id
            this.MemberNO = data.model.MemberNO; // 会员卡号
            this.TenantId = data.model.TenantId; //	经销商id
            this.Type = data.model.Type; // 消费类型

            this.setData({
                loaded: true,
                Name: this.data.Name,
                Balance: this.data.Balance
            });
        });
    }
    /**
     * 同步消费金额
     * @param e 
     */
    public syncAmount(e) {
        let val = parseFloat(e.detail.value) || 0;

        // 负数取绝对值
        if (val < 0) {
            val = Math.abs(val);
        }
        // 数值边界判断
        if (val >= 10000000) {
            toast.showWarning('请输入小于1000万的合法数字');
            val = 9999999;
        }
        // 转为字符串
        let valStr = val.toFixed(2);
        // 限两位小数
        valStr = valStr.slice(0, valStr.indexOf('.') != -1 ? valStr.indexOf('.') + 3 : valStr.length);


        this.Amount = Number(valStr);
        this.setData({
            AmountStr: valStr
        });

        return this.Amount;
    }
    /**
     * 同步输入
     */
    public syncInput(e) {
        const name = e.currentTarget.dataset.name,
            val = e.detail.value;
        this[name] = val;
    }
    /**
     * 
     * @param e 确认扣款
     */
    public confirmcharge(e) {
        if (!this.Title || !this.ShopOrderNO || !this.Amount) {
            toast.showWarning('请完善必填项');
            return;
        }
        if (this.Amount > this.data.Balance) {
            toast.showWarning('余额不足');
            return;
        }
        toast.showLoading('正在提交',true);
        request({
            url: domain + '/ApiRechargeConsumptionLog/ApiConsumptionCommit',
            data: {
                ticket: wx.getStorageSync('ticket'),
                CustomerId: this.id,
                MemberNO: this.MemberNO,
                TenantId: this.TenantId,
                Type: this.Type,
                Amount: this.Amount,
                Title: this.Title,
                ShopOrderNO: this.ShopOrderNO,
                Remark: this.Remark
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) {
                return;
            }
            toast.hide();
            this.modal('扣款成功').then(res => {
                console.log(getCurrentPages());
                wx.navigateBack({
                    delta:1
                });
            })
        });
    }
    /**
     * 弹出模态框
     * @param title 标题 
     */
    private modal(title) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                showCancel: false,
                confirmColor: '#54b4ef',
                confirmText: '关闭',
                success() {
                    resolve();
                }
            });
        })
    }
}

Page(new ChargePage());