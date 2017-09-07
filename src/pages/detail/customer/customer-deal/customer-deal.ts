import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
import toast from '../../../../modules/toast';
import { resCodeCheck } from '../../../../modules/auth';
import { domain } from '../../../../config/url.config';
import { modal } from '../../../../modules/modal';

interface Data {
    loaded: boolean;
    // isFirst: boolean;
    paddingLayerHeight: number;

    id: number;
    OrderDate: string; // 订单日期
    CarName: string, // 车系车型字符串
    CarBrandId: number; // 车型 id
    CarModelId: number; // 车系 id
    IsLoan: boolean; // 金融类型
    Price: number; //价格
    Deposit: number; // 定金
    BuyCarDate: string; // 发票日期
    DeliverDate: string; // 交车日期
    LicenseDate: string; // 上牌日期 
    License: string; // 车牌号
    FrameNo: string; // 车架号
    AfterEmployeeId: string; // 售后顾问 id

    CarOptions: any[]; // 车型车系 picker 选项二维对象数组
    CarIndexs: number[]; // 车型车系 picker 选中的索引数组

    LoanOptions: any; // 金融类型 选项 ['贷款','全款']
    LoanIndex: number; // 金融类型 选项 索引

    AfterEmployeeOptions: any[]; // 售后顾问 选项 对象数组
    AfterEmployeeIndex: number; // 售后顾问 选项 索引
}
/**
 * @class CustomerDealPage
 * @extends {BasePage}
 */
class CustomerDealPage extends BasePage {
    private id: number = 0;
    private CarBrands: any[] = []; // 请求返回的车系车型数组

    private data: Data = {
        loaded: false,
        paddingLayerHeight: 0,

        id: 0,
        OrderDate: dateFormat('yyyy/MM/dd', new Date()),
        CarName: '',
        CarBrandId: 0,
        CarModelId: 0,
        IsLoan: false,
        Price: 0,
        Deposit: 0,
        BuyCarDate: '',
        DeliverDate: dateFormat('yyyy/MM/dd', new Date()),
        LicenseDate: '',
        License: '',
        FrameNo: '',
        AfterEmployeeId: '',

        CarOptions: [[], []],
        CarIndexs: [0, 0],

        LoanOptions: ['全款', '贷款'],
        LoanIndex: 0,

        AfterEmployeeOptions: [],
        AfterEmployeeIndex: -1,
    }
    private onLoad(options) {
        this.data.id = this.id = ~~options.id;
        // this.data.isFirst = !!~~options.isFisrt;
        this.setPaddingLayerHeight();
        this.loadData();
    }
    /**
     * 设置填充层高度
     * @private
     * @memberof CustomerDealPage
     */
    private setPaddingLayerHeight() {
        wx.createSelectorQuery().select('.m-operation').boundingClientRect(rect => {
            this.setData({ paddingLayerHeight: rect.height });
        }).exec();
    }
    /**
     * 加载数据
     * @private
     * @memberof CustomerOrderPage
     */
    private loadData() {
        toast.showLoading();
        // 并发请求 车型列表数据 和 售后顾问列表数据，当两个请求返回时发送页面数据请求
        Promise.all([this.loadCar(), this.loadAfterEmployee()]).then(() => {
            // 请求默认数据
            request({
                url: domain + '/ApiCustomerPre/DealRecord',
                data: {
                    ticket: wx.getStorageSync('ticket'),
                    id: this.id
                }
            }).then((res: any) => {
                if (resCodeCheck(res)) {
                    return;
                }
                const data = res.data;

                // 判断如果有意向车型 触发修改
                if (data.carBrandId && data.carModelId) {
                    // 查找索引
                    let brandIndex = -1, modelIndex = -1;
                    // 查找车系索引
                    for (let i = 0, brandsLen = this.CarBrands.length; i < brandsLen; i++) {
                        if (this.CarBrands[i].Id === data.carBrandId) {
                            brandIndex = i;
                            for (let j = 0; j < this.CarBrands[i].Children.length; j++) {
                                if (this.CarBrands[i].Children[j].Id === data.carModelId) {
                                    modelIndex = j;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    // 如果没有找到索引，默认为0
                    brandIndex = brandIndex || 0;
                    modelIndex = modelIndex || 0;

                    // 如果 brandIndex != 0，修改 CarOptions 第二列数据
                    if (brandIndex) {
                        this.changeColumn(brandIndex);
                    }
                    this.changeCar([brandIndex, modelIndex]);
                }

                // 已绑定售后顾问，则修改页面显示的索引，并锁定 picker
                if (data.AfterEmployeeId) {
                    const op = this.data.AfterEmployeeOptions;
                    for (let i = 0, len = op.length; i < len; i++) {
                        if (op[i].Id === data.AfterEmployeeId) {
                            this.data.AfterEmployeeIndex = i;
                            break;
                        }
                    }
                    this.setData({
                        AfterEmployeeIndex: this.data.AfterEmployeeIndex = i
                    });
                }

                toast.hide();
                this.setData({
                    loaded: true,

                    OrderDate: data.orderDate || this.data.OrderDate,
                    CarName: data.carName || this.data.CarName,
                    CarBrandId: data.carBrandId || 0,
                    CarModelId: data.carModelId || 0,

                    Price: data.Price || 0,
                    Deposit: data.Deposit || 0,
                    IsLoan: !!data.IsLoan,
                    LoanIndex: ~~data.IsLoan,

                    BuyCarDate: data.buyCarDate || this.data.BuyCarDate,
                    DeliverDate: data.deliverDate || this.data.DeliverDate,
                    LicenseDate: data.licenseDate || this.data.LicenseDate,
                    License: data.License || this.data.License,
                    FrameNo: data.FrameNo || this.data.FrameNo,

                    AfterEmployeeId: data.AfterEmployeeId || this.data.AfterEmployeeId
                });
            });
        });
    }

    /**
     * 获取车型
     * @private
     * @returns Request Promise 
     * @memberof CustomerOrderPage
     */
    private loadCar() {
        return new Promise((resolve, reject) => {
            // 获取车型
            request({
                url: domain + '/Car/CarBrand/CarSelectForSEC',
                data: {
                    ticket: wx.getStorageSync('ticket'),
                    role: 'After'
                }
            }).then((res: any) => {
                if (resCodeCheck(res)) {
                    reject();
                    return;
                }
                this.CarBrands = res.data.CarBrands;

                // 默认车型
                this.data.CarOptions[0] = this.CarBrands;
                // 默认车系
                this.data.CarOptions[1] = this.CarBrands[0].Children;
                // 设置默认 picker
                this.data.CarIndexs = [0, 0];

                this.setData({
                    CarIndexs: this.data.CarIndexs,
                    CarOptions: this.data.CarOptions
                });
                resolve();
            });
        });
    }

    /**
     * 加载售后顾问列表
     * @private
     * @memberof CustomerDealPage
     */
    private loadAfterEmployee() {
        return new Promise((resolve, reject) => {
            request({
                url: domain + '/Org/Employee/ReadForAfter',
                data: {
                    ticket: wx.getStorageSync('ticket'),
                    role: 'WX_Service'
                }
            }).then((res: any) => {
                if (resCodeCheck(res)) { return }
                this.data.AfterEmployeeOptions = res.data;
                this.setData({
                    AfterEmployeeOptions: this.data.AfterEmployeeOptions
                });
                resolve();
            });
        })
    }
    /**
     * 改变金融类型
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeLoan(e) {
        const index = ~~e.detail.value;
        this.data.IsLoan = !!index;
        this.data.LoanIndex = index;
        this.setData({
            IsLoan: this.data.IsLoan,
            LoanIndex: this.data.LoanIndex
        });
    }

    /**
     * 改变金额
     * @param {any} e 
     * @returns 返回映射到 input 的值
     * @memberof CustomerOrderPage
     */
    public changeMoney(e) {
        const name = e.currentTarget.dataset.name;
        let val = e.detail.value;
        // 正则替换 -> xxxx.xx
        val = val.replace(/^(\d*)(\.?)(\d{0,2}).*$/, '$1$2$3');
        this.data[name] = parseFloat(val || 0);
        return val;
    }
    /**
     * 文本输入框同步
     * @param {any} e 
     * @memberof CustomerDealPage
     */
    public changeInput(e) {
        const name = e.currentTarget.dataset.name,
            val = e.detail.value;
        this.data[name] = val;
    }
    /**
     * 日期组件统一处理方法
     * 改变日期
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeDate(e) {
        // 获得 当前 picker 控件对应 name
        const name = e.currentTarget.dataset.name;
        // 获得日期值，正则替换
        const val = e.detail.value.replace(/-/g, '/');
        this.data[name] = val;
        console.log(name, val);
        this.setData({
            OrderDate: this.data.OrderDate,
            DeliverDate: this.data.DeliverDate,
            BuyCarDate: this.data.BuyCarDate,
            LicenseDate: this.data.LicenseDate,

        });
    }
    /**
     * 改变车型车系
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeCar(e) {
        // 手动触发
        if (e instanceof Array) { // [brandIndex, modelIndex]
            this.data.CarIndexs = e;
        }
        // 事件触发修改
        else if (e instanceof Object) {
            this.data.CarIndexs = e.detail.value;
        }

        const [brandIndex, modelIndex] = this.data.CarIndexs;

        this.data.CarName =
            this.CarBrands[brandIndex].Name + ' ' + this.CarBrands[brandIndex].Children[modelIndex].Name;

        this.data.CarBrandId = this.CarBrands[brandIndex].Id;
        this.data.CarModelId = this.CarBrands[brandIndex].Children[modelIndex].Id;

        this.setData({
            CarIndexs: this.data.CarIndexs,
            CarName: this.data.CarName
        });
    }
    /**
     * 根据车型改变车系数据
     * 当 第一列变化时改变第二列选项
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeColumn(e) {
        let brandIndex = 0;
        // 事件触发修改
        if (typeof e === 'object' && e.detail.column === 0) {
            // 改变第二列
            brandIndex = e.detail.value;
            this.data.CarOptions[1] = this.CarBrands[brandIndex].Children;
            this.setData({ CarOptions: this.data.CarOptions });
        }
        // 手动调用修改
        else if (typeof e === 'number') {
            brandIndex = e;
            this.data.CarOptions[1] = this.CarBrands[brandIndex].Children;
            this.setData({ CarOptions: this.data.CarOptions });
        }
    }


    /**
     * 改变售后顾问
     * @param {any} e 
     * @memberof CustomerDealPage
     */
    public changeAfterEmployee(e) {
        /**
         * 注意！
         * 视图层使用了 :disabled="AfterEmployeeId ? true : false"
         * 进行判断是否已绑定售后，绑定了则禁用选择器
         * 故此方法内不应该修 AfterEmployeeId (修改后会导致页面 picker 被锁)
         * 应在最后发送请求时调用 getAfterEmployeeId 获取 AfterEmployeeId
         */
        const index: number = ~~e.detail.value;
        this.data.AfterEmployeeIndex = index;
        this.setData({
            AfterEmployeeIndex: this.data.AfterEmployeeIndex
        });
    }

    /**
     * 获取售后顾问员工 id
     * 通过当前 AfterEmployeeIndex 在 AfterEmployeeOptions 中获取
     * @private
     * @returns {string} 售后顾问员工 id
     * @memberof CustomerDealPage
     */
    private getAfterEmployeeId(): string {
        if (this.data.AfterEmployeeIndex != -1) {
            return this.data.AfterEmployeeOptions[this.data.AfterEmployeeIndex].Id;
        } else {
            return '';
        }
    }

    private afterEmployeeBinded(e) {
        if (e.currentTarget.dataset.dis) {
            toast.showWarning('已绑定售后顾问，无法修改');
        }
    }

    /**
     * 提交成交信息
     * @memberof CustomerDealPage
     */
    public save() {
        // 表单验证
        // 有后端返回的售后顾问id直接获取，没有则获取用户选择的
        const afterEmployeeId = this.data.AfterEmployeeId || this.getAfterEmployeeId();
        const rules = [
            { rule: this.data.CarBrandId && this.data.CarModelId, warn: '请选择车型' },
            { rule: this.data.Price > 0, warn: '请输入价格' },
            { rule: this.data.BuyCarDate, warn: '请选择发票日期' },
            { rule: this.data.LicenseDate, warn: '请选择上牌日期' },
            { rule: this.data.BuyCarDate >= this.data.OrderDate, warn: '发票日期不能小于订单日期' },
            { rule: this.data.DeliverDate >= this.data.OrderDate, warn: '交车日期不能小于订单日期' },
            { rule: this.data.LicenseDate >= this.data.OrderDate, warn: '上牌日期不能小于订单日期' },
            { rule: this.data.BuyCarDate <= dateFormat('yyyy/MM/dd', new Date()), warn: '发票日期不能大于今天' },
            { rule: this.data.LicenseDate <= dateFormat('yyyy/MM/dd', new Date()), warn: '上牌日期不能大于今天' },
            {
                // rule: /^$/.test(this.data.License),
                rule: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(this.data.License),
                warn: '请输入有效的车牌号'
            },
            { rule: afterEmployeeId, warn: '请指定售后顾问' }
        ];

        if (!this.validate(rules)) { return }

        toast.showLoading('', true);
        request({
            url: domain + '/UC/CustomerPre/ModifyForDeal',
            data: {
                ticket: wx.getStorageSync('ticket'),
                id: this.id,
                OrderDate: this.data.OrderDate,
                CarBrandId: this.data.CarBrandId,
                CarModelId: this.data.CarModelId,
                IsLoan: this.data.IsLoan,
                Price: this.data.Price,
                Deposit: this.data.Deposit,
                BuyCarDate: this.data.BuyCarDate,
                DeliverDate: this.data.DeliverDate,
                LicenseDate: this.data.LicenseDate,
                License: this.data.License,
                FrameNo: this.data.FrameNo,
                AfterEmployeeId: afterEmployeeId
            }
        }).then(res => {
            if (resCodeCheck(res)) { return }
            toast.hide();
            modal.show({
                title: '',
                content: '提交成功',
                confirmText: '确定',
                showCancel: false
            }).then(flag => {
                const pages = getCurrentPages();
                pages[pages.length - 2].refreshFlag = true;
                wx.navigateBack()
            })
        });
    }

    /**
     * 验证规则是否通过
     * @private
     * @param {any} rule 
     * @returns {boolean} true 验证通过 false 验证未通过
     * @memberof CustomerDealPage
     */
    private validate(rules: { rule: any; warn: string; }[]): boolean {
        if (!rules) { return true }
        return rules.every(item => {
            if (!!item.rule) {
                return true;
            } else {
                toast.showWarning(item.warn);
                return false;
            }
        })
    }
}

Page(new CustomerDealPage());