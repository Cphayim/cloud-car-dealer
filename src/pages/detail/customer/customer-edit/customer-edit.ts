import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
import { resCodeCheck } from '../../../../modules/auth';
import { domain } from '../../../../config/config';
import toast from '../../../../modules/toast';
import { modal } from '../../../../modules/modal';
/*
 * 客户详情-编辑 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 17:56:18 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-08 18:27:21
 */


interface ConfigOptions {
    Key: string;
    Name: string;
    Value: number;
}

interface Data {
    loaded: boolean; // 页面是否已首次加载完毕

    // 客户资料
    customer: {
        /**
         * 基本信息
         */
        Name?: string; // 客户姓名
        MobilePhone?: string; // 手机号码
        Sex?: number; // 性别 0未知 1男 2女
        Birthday?: string; // 生日

        Industry?: number; // 行业
        Profession?: number; // 职业
        Income?: number; // 月收入
        FamilyStructure?: number; // 家庭结构
        HasHouse?: boolean; // 是否购房
        IdCard?: string; // 身份证

        /**
         * 潜客信息
         */
        CustomerPre: { // 提交表单时用的格式
            CarName?: string; // 车系车型字符串
            CarBrandId?: number; // 车系 id
            CarModelId?: number; // 车型 id
            BuyTimeRange?: number; // 购车时间
            PriceRange?: number; // 购车预算
            KeepCarModel?: string; // 保有车型
            Purchase?: number; // 购车性质
            IsLoan?: boolean; // 金融类型
            CarUsage?: number; // 车辆用途
            Purpose?: string; // 关注特点
            OrderDate?: string; // 订单日期
            DeliverDate?: string; // 交车日期
        }
    }
    /**
     * 配置项
     * @type {ConfigOptions[]}
     * @memberof Data
     */
    IndustryOptions?: ConfigOptions[]; // 行业
    IndustryIndex: number;
    ProfessionOptions?: ConfigOptions[]; // 职业
    ProfessionIndex: number;
    IncomeOptions?: ConfigOptions[]; // 月收入
    IncomeIndex: number;
    FamilyStructureOptions?: ConfigOptions[]; // 家庭结构
    FamilyStructureIndex: number;
    BuyTimeRangeOptions?: ConfigOptions[]; // 购车时间
    BuyTimeRangeIndex?: number;
    PriceRangeOptions?: ConfigOptions[]; // 购车预算
    PriceRangeIndex: number;
    PurchaseOptions?: ConfigOptions[]; // 购车性质
    PurchaseIndex: number;
    CarUsageOptions?: ConfigOptions[]; // 车辆用途
    CarUsageIndex: number;

    SexOptions: string[]; // 性别
    SexIndex: number;
    LoanIndex: number; // 金融选项索引
    LoanOption: string[];
    CarIndexs: number[]; // 车型索引
    CarOptions: any[]; // 车型选项二维数组
    IsLoanIndex: number;
    IsLoanOptions: string[];
    HasHouseIndex: number;
    HasHouseOptions: string[];
    PurposeSwitchs: boolean[];
    PurposeOptions: string[];
}

class CustomerEditPage extends BasePage {
    private id: number = 0;
    private CarBrands: any[] = []; // 请求返回的车系车型数组
    public data: Data = {
        loaded: false,
        customer: {
            /**
             * 基本信息
             */
            Name: '',
            MobilePhone: '',
            Sex: 0,
            Birthday: '',

            Industry: -1, // 行业
            Profession: -1, // 职业
            Income: -1, // 月收入
            FamilyStructure: -1, // 家庭结构
            HasHouse: false, // 是否购房
            IdCard: '', // 身份证

            /**
             * 潜客信息
             */
            CustomerPre: { // 提交表单时用的格式
                CarName: '', // 车系车型字符串
                CarBrandId: 0, // 车系 id
                CarModelId: 0, // 车型 id
                BuyTimeRange: -1, // 购车时间
                PriceRange: -1, // 购车预算
                KeepCarModel: '', // 保有车型
                Purchase: -1, // 购车性质
                IsLoan: false, // 金融类型
                CarUsage: -1, // 车辆用途
                Purpose: '', // 关注特点
                OrderDate: '', // 订单日期
                DeliverDate: '', // 交车日期
            }
        },

        IndustryOptions: [], // 行业
        IndustryIndex: 0,
        ProfessionOptions: [], // 职业
        ProfessionIndex: 0,
        IncomeOptions: [], // 月收入
        IncomeIndex: 0,
        FamilyStructureOptions: [],
        FamilyStructureIndex: 0,
        BuyTimeRangeOptions: [],
        BuyTimeRangeIndex: 0,
        PriceRangeOptions: [],
        PriceRangeIndex: 0,
        PurchaseOptions: [],
        PurchaseIndex: 0,
        CarUsageOptions: [],
        CarUsageIndex: 0,

        SexOptions: ['未知', '男', '女'],
        SexIndex: 0,
        LoanIndex: 0,
        LoanOption: ['全款', '贷款'],
        CarIndexs: [0, 0],
        CarOptions: [[], []],
        IsLoanIndex: -1,
        IsLoanOptions: ['否', '是'],
        HasHouseIndex: -1,
        HasHouseOptions: ['否', '是'],
        PurposeSwitchs: [false, false, false, false, false, false, false],
        PurposeOptions: ['品牌', '外形', '动力', '操控', '舒适', '安全', '价格']
    }

    // 同步客户信息到视图
    private syncToView() {
        this.setData({
            customer: this.data.customer,

            IndustryOptions: this.data.IndustryOptions,
            IndustryIndex: this.data.IndustryIndex,
            ProfessionOptions: this.data.ProfessionOptions,
            ProfessionIndex: this.data.ProfessionIndex,
            IncomeOptions: this.data.IncomeOptions,
            IncomeIndex: this.data.IncomeIndex,
            FamilyStructureOptions: this.data.FamilyStructureOptions,
            FamilyStructureIndex: this.data.FamilyStructureIndex,
            BuyTimeRangeOptions: this.data.BuyTimeRangeOptions,
            BuyTimeRangeIndex: this.data.BuyTimeRangeIndex,
            PriceRangeOptions: this.data.PriceRangeOptions,
            PriceRangeIndex: this.data.PriceRangeIndex,
            PurchaseOptions: this.data.PurchaseOptions,
            PurchaseIndex: this.data.PurchaseIndex,
            CarUsageOptions: this.data.CarUsageOptions,
            CarUsageIndex: this.data.CarUsageIndex,

            SexIndex: this.data.SexIndex,
            LoanIndex: this.data.LoanIndex,
            CarIndexs: this.data.CarIndexs,
            HasHouseIndex: this.data.HasHouseIndex,
            IsLoanIndex: this.data.IsLoanIndex,
            PurposeSwitchs: this.data.PurposeSwitchs
        });
    }


    private onLoad(options) {
        this.id = ~~options.id;
        wx.setNavigationBarTitle({ title: '完善客户资料' });
        this.loadData();
    }


    private loadData() {
        toast.showLoading();
        this.loadCar().then(res => {
            request({
                url: domain + '/ApiCustomerPre/ModifyPre',
                data: {
                    id: this.id
                }
            }).then((res: any) => {
                if (resCodeCheck(res)) { return }
                const { customer, industry, profession, income,
                    familyStructure, buyTimeRange,
                    priceRange, purchase, carUsage } = res.data;
                this.data.customer = customer;
                // 
                if (this.data.customer.Birthday) {
                    this.data.customer.Birthday =
                        this.data.customer.Birthday.replace(/^(\d{4}\d{2}\d{2}).*$/, '$1');
                }
                if (this.data.customer.CustomerPre.OrderDate) {
                    this.data.customer.CustomerPre.OrderDate =
                        this.data.customer.CustomerPre.OrderDate.replace(/^(\d{4}\d{2}\d{2}).*$/, '$1');
                }
                if (this.data.customer.CustomerPre.DeliverDate) {
                    this.data.customer.CustomerPre.DeliverDate =
                        this.data.customer.CustomerPre.DeliverDate.replace(/^(\d{4}\d{2}\d{2}).*$/, '$1');
                }
                // 插入配置项
                this.data.IndustryOptions = industry;
                this.data.ProfessionOptions = profession;
                this.data.IncomeOptions = income;
                this.data.FamilyStructureOptions = familyStructure;
                this.data.BuyTimeRangeOptions = buyTimeRange;
                this.data.PriceRangeOptions = priceRange;
                this.data.PurchaseOptions = purchase;
                this.data.CarUsageOptions = carUsage;
                // 设置 配置项 当前索引 为 返回的值对应的索引
                this.data.SexIndex = this.data.customer.Sex;
                this.data.IndustryIndex = this.getConfIndexByConfValue({ ops: this.data.IndustryOptions, val: this.data.customer.Industry });
                this.data.ProfessionIndex = this.getConfIndexByConfValue({ ops: this.data.ProfessionOptions, val: this.data.customer.Profession });
                this.data.IncomeIndex = this.getConfIndexByConfValue({ ops: this.data.IncomeOptions, val: this.data.customer.Income });
                this.data.FamilyStructureIndex = this.getConfIndexByConfValue({ ops: this.data.FamilyStructureOptions, val: this.data.customer.FamilyStructure });
                this.data.BuyTimeRangeIndex = this.getConfIndexByConfValue({ ops: this.data.BuyTimeRangeOptions, val: this.data.customer.CustomerPre.BuyTimeRange });
                this.data.PriceRangeIndex = this.getConfIndexByConfValue({ ops: this.data.PriceRangeOptions, val: this.data.customer.CustomerPre.PriceRange });
                this.data.PurchaseIndex = this.getConfIndexByConfValue({ ops: this.data.PurchaseOptions, val: this.data.customer.CustomerPre.Purchase });
                this.data.CarUsageIndex = this.getConfIndexByConfValue({ ops: this.data.CarUsageOptions, val: this.data.customer.CustomerPre.CarUsage });

                // 关注特点
                if (this.data.customer.CustomerPre.Purpose) {
                    this.data.PurposeOptions.forEach((item, index) => {
                        // 如果在返回字符串中可以找到当前遍历的 options ，设置对应索引的 switch 为 true
                        if (this.data.customer.CustomerPre.Purpose.indexOf(item) !== -1) {
                            this.data.PurposeSwitchs[index] = true;
                        }
                    })
                }

                this.syncToView();

                toast.hide();
                this.setData({
                    loaded: true
                });
            });
        });
    }

    /**
     * 通过配置项的值 找到配置项的索引 
     * @private
     * @param {any} { ops = [], val = -1 } 
     * @memberof CustomerEditPage
     */
    private getConfIndexByConfValue({ ops = [], val = -1 }: { ops: any[], val: number }) {
        let idx = 0;
        if (val > 0) {
            ops.forEach((item, index) => {
                if (item.Value == val) {
                    idx = index;
                }
            });
        }
        return idx;
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
     * 改变金融类型
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeLoan(e) {
        const index = ~~e.detail.value;
        this.data.customer.CustomerPre.IsLoan = !!index;
        this.data.LoanIndex = index;
        this.syncToView();
    }
    /**
     * 修改配置项类型的选项
     * @param {any} e 
     * @memberof CustomerEditPage
     */
    public changeConfOp(e) {
        const name = e.currentTarget.dataset.name,
            fixName = e.currentTarget.dataset.fixName,
            index = ~~e.detail.value;
        // 修改 index
        this.data[name + 'Index'] = index;
        // 修改提交值，配置项索引为 0 的选项 value 为 -1，其余 value 等于 index
        let value = index === 0 ? -1 : index;
        if (fixName == 'pre') {
            this.data.customer.CustomerPre[name] = value;
        } else {
            this.data.customer[name] = value;
        }
        this.syncToView();
    }
    /**
     * 修改性别
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeSex(e) {
        const index = ~~e.detail.value;
        this.data.customer.Sex = this.data.SexIndex = index;
        this.syncToView();
    }

    /**
     * 设置关注特点
     * @param {any} e 
     * @returns 
     * @memberof CustomerEditPage
     */
    public setPurpose(e) {
        const target = e.target,
            index = target.dataset.index,
            optionName = target.dataset.optionName;
        if (index === undefined || optionName === undefined) return;
        // 取反
        this.data.PurposeSwitchs[index] = !this.data.PurposeSwitchs[index];
        // 返回被选中的数组
        const arr = this.data.PurposeOptions.filter((item, index) => {
            if (this.data.PurposeSwitchs[index]) {
                return item;
            }
        });
        this.data.customer.CustomerPre.Purpose = arr.join(',');
        this.syncToView();
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
        this.data.customer[name] = parseFloat(val || 0);
        return val;
    }
    /**
     * 文本输入框同步
     * @param {any} e 
     * @memberof CustomerDealPage
     */
    public changeInput(e) {
        const name = e.currentTarget.dataset.name,
            fixName = e.currentTarget.dataset.fixName,
            val = e.detail.value;
        // console.log(name,fixName,val);
        if (fixName == 'pre') {
            this.data.customer.CustomerPre[name] = val;
        } else {
            this.data.customer[name] = val;
        }
        // this.syncToView();
    }
    /**
     * 日期组件统一处理方法
     * 改变日期
     * @param {any} e 
     * @memberof CustomerOrderPage
     */
    public changeDate(e) {
        // 获得 当前 picker 控件对应 name
        const name = e.currentTarget.dataset.name,
            fixName = e.currentTarget.dataset.fixName;
        // 获得日期值，正则替换
        const val = e.detail.value.replace(/-/g, '/');
        if (fixName == 'pre') {
            this.data.customer.CustomerPre[name] = val;
        } else {
            this.data.customer[name] = val;
        }
        this.syncToView();
    }
    /**
     * 设置 true 或 false
     * @param {any} e 
     * @memberof CustomerEditPage
     */
    public setFalseOrTrue(e) {
        const name = e.currentTarget.dataset.name,
            fixName = e.currentTarget.dataset.fixName;
        const index = ~~e.detail.value;
        this.data[name + 'Index'] = index;
        console.log(name, index);
        let val = !!index;
        if (fixName == 'pre') {
            this.data.customer.CustomerPre[name] = val;
        } else {
            this.data.customer[name] = val;
        }
        this.syncToView();
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

        this.data.customer.CustomerPre.CarName =
            this.CarBrands[brandIndex].Name + ' ' + this.CarBrands[brandIndex].Children[modelIndex].Name;

        this.data.customer.CustomerPre.CarBrandId = this.CarBrands[brandIndex].Id;
        this.data.customer.CustomerPre.CarModelId = this.CarBrands[brandIndex].Children[modelIndex].Id;
        this.syncToView();
        // this.setData({
        //     CarIndexs: this.data.CarIndexs,
        //     CarName: this.data.customer.CarName
        // });
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
     * 提交表单
     * @memberof CustomerEditPage
     */
    public save() {
        if (!this.data.customer.Name) {
            // toast.show
        }
        toast.showLoading('', true);
        let data = JSON.parse(JSON.stringify(this.data.customer));
        request({
            url: domain + '/UC/Customer/Modify',
            data: data,
            second: true
        }).then(res => {
            if (resCodeCheck(res)) { return }
            toast.hide();
            modal.show({
                title: '',
                content: '提交成功',
                showCancel:false
            }).then(flag=>{
                const pages = getCurrentPages();
                pages[pages.length-2].refreshFlag = true;
                wx.navigateBack();
            });
        });
    }
}

Page(new CustomerEditPage());