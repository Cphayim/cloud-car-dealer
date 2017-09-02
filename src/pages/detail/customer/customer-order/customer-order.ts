import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import { resCodeCheck } from '../../../../modules/auth';

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

    CarOptions: any[];
    CarIndexs: number[];
    LoanOptions: any;
    LoanIndex: number;
}
class CustomerOrderPage extends BasePage {
    private id: number = 0;
    public data: Data = {
        loaded: false,
        id: 0,
        OrderDate: dateFormat('yyyy/MM/dd', new Date()),
        CarName: '',
        CarBrandId: 0,
        CarModelId: 0,
        Price: 0,
        Deposit: 0,
        IsLoan: false,
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

    private loadData() {

        // 获取车型
        request({
            url: domain + '/Car/CarBrand/CarSelectForSEC',
            data: {
                ticket: wx.getStorageSync('ticket'),
                role: 'After'
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) {
                return;
            }
            const CarBrands: any[] = res.data.CarBrands;

            CarBrands.forEach(carBrand => {
                // push carBrand
                this.data.CarOptions[0].push({
                    id: carBrand.Id,
                    // name:
                });
            });
        });

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
            this.setData({
                OrderDate: data.orderDate || dateFormat('yyyy-MM-dd', new Date()),
                CarName: data.carName || '',
                CarBrandId: data.carBrandId,
                CarModelId: data.carModelId,
            })
        });
    }

    /**
     * 改变日期
     * @param e 
     */
    public changeDate(e) {
        const name = e.currentTarget.dataset.name;
        const val = e.detail.value.replace(/-/g, '/');
        this.data[name] = val;
        this.setData({
            OrderDate: this.data.OrderDate,
            DeliverDate: this.data.DeliverDate
        });
    }

    /**
     * 改变金融类型
     */
    public changeLoan(e) {
        const index = ~~e.detail.value;
        this.data.IsLoan = !!index;
        this.setData({
            IsLoan: this.data.IsLoan
        });
    }

    public changeCar(e) {
        console.log('changeCar');
        console.log(e);
    }
    public changeColumn(e) {
        // console.log('changeColumn');
        // if (e.detail.column == 0) {
        //     if (e.detail.value == 0) {
        //         this.data.testArr[1] = ['a-1', 'a-2'];
        //     } else if (e.detail.value == 1) {
        //         this.data.testArr[1] = ['b-1', 'b-2'];
        //     }
        // }
        // this.setData({
        //     testArr: this.data.testArr
        // })
    }
}

Page(new CustomerOrderPage());