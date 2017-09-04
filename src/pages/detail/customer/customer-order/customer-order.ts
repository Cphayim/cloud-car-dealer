import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck } from '../../../../modules/auth';
import toast from '../../../../modules/toast';
import { modal } from '../../../../modules/modal';

interface Data {
    loaded: boolean;

    id: number;
    OrderDate: string; // 订单日期
    CarName: string, // 车系车型字符串
    CarBrandId: number; // 车型 id
    CarModelId: number; // 车系 id
    Price: number; //价格
    Deposit: number; // 定金
    IsLoan: boolean; // 金融类型
    DeliverDate: string; // 交车日期

    CarOptions: any[]; // picker 选项二维对象数组
    CarIndexs: number[]; // picker 选中的索引数组

    LoanOptions: any;
    LoanIndex: number;
}
class CustomerOrderPage extends BasePage {
    private isLock: boolean = false; // 提交锁
    private id: number = 0;
    private CarBrands: any[] = []; // 请求返回的车系车型数组

    public data: Data = {
        loaded: false,
        id: 0,
        OrderDate: dateFormat('yyyy/MM/dd', new Date()),
        CarName: '',
        CarBrandId: 0,
        CarModelId: 0,
        IsLoan: false,
        Price: 0,
        Deposit: 0,
        DeliverDate: dateFormat('yyyy/MM/dd', new Date()),

        CarOptions: [[], []],
        CarIndexs: [0, 0],

        LoanOptions: ['全款', '贷款'],
        LoanIndex: 0
    }
    private onLoad(options) {
        const id: number = ~~options.id;
        this.data.id = this.id = id;
        this.loadData();
    }
    /**
     * 获取车型车系
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
        })

    }
    /**
     * 加载数据
     */
    private loadData() {
        toast.showLoading();
        // 先请求车型车系数据，当请求成功后在再请求默认数据
        this.loadCar().then(() => {
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
                    for (let i = 0; i < this.CarBrands.length; i++) {
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

                toast.hide();
                this.setData({
                    loaded: true,

                    OrderDate: data.orderDate || this.data.OrderDate,

                    CarName: data.carName || '',
                    CarBrandId: data.carBrandId,
                    CarModelId: data.carModelId,

                    IsLoan: !!data.IsLoan,
                    LoanIndex: ~~data.IsLoan,

                    DeliverDate: data.deliverDate || this.data.DeliverDate
                });
            });
        });

    }


    /**
     * 改变金融类型
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
    public changeMoney(e) {
        const name = e.currentTarget.dataset.name;
        let val = e.detail.value;
        val = val.replace(/^(\d*)(\.?)(\d{0,2}).*$/, '$1$2$3');
        this.data[name] = parseFloat(val || 0);
        this.setData({
            Price: this.data.Price,
            Deposit: this.data.Deposit
        });
        return val;
    }
    /**
     * 日期组件统一处理函数
     * 改变日期
     * @param e 
     */
    public changeDate(e) {
        // 获得 当前 picker 控件对应 name
        const name = e.currentTarget.dataset.name;
        // 获得日期值，正则替换
        const val = e.detail.value.replace(/-/g, '/');
        this.data[name] = val;
        this.setData({
            OrderDate: this.data.OrderDate,
            DeliverDate: this.data.DeliverDate
        });
    }
    /**
     * 改变车型车系
     * @param e 
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
     * @param e 
     */
    public changeColumn(e) {
        let brandIndex = 0;
        // 事件触发修改
        if (typeof e === 'object' && e.detail.column === 0) {
            brandIndex = e.detail.value;
        }
        // 手动调用修改
        else if (typeof e === 'number') {
            brandIndex = e;
        }
        // 改变第二列
        this.data.CarOptions[1] = this.CarBrands[brandIndex].Children;

        this.setData({
            CarOptions: this.data.CarOptions
        });
    }

    /**
     * 提交数据
     */
    public save() {
        if (this.isLock) {
            return;
        }
        // 表单验证
        if (!this.data.CarName || !this.data.CarBrandId || !this.data.CarModelId) {
            toast.showWarning('请选择车型');
            return;
        }
        if (!this.data.Price) {
            toast.showWarning('请填写价格');
            return;
        }
        if (this.data.OrderDate > this.data.DeliverDate) {
            toast.showWarning('交车日期不能早于订单日期');
            return;
        }
        // 锁定提交按钮，防止重复提交
        this.isLock = true;
        toast.showLoading();
        request({
            url: domain + '/UC/CustomerVisit/ModifyForOrder',
            data: {
                ticket: wx.getStorageSync('ticket'),
                id: this.id,
                OrderDate: this.data.OrderDate,
                CarBrandId: this.data.CarBrandId,
                CarModelId: this.data.CarModelId,
                IsLoan: this.data.IsLoan,
                Price: this.data.Price,
                Deposit: this.data.Deposit,
                DeliverDate: this.data.DeliverDate
            }
        }).then(res => {
            if (resCodeCheck(res)) {
                return;
            }
            this.isLock = false;
            toast.hide();
            modal.show({
                title: '保存成功',
                content: '',
                showCancel: false
            }).then(flag => {
                const pages = getCurrentPages();
                // 设置父页面的刷新属性
                pages[pages.length - 2].refreshFlag = true;
                wx.navigateBack();
            });
        });

        setTimeout(() => {
            this.isLock = false;
        }, 3000);
    }
}

Page(new CustomerOrderPage());