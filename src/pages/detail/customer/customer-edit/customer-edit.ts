import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
/*
 * 客户详情-编辑 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 17:56:18 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-16 17:12:51
 */

interface CustomerInfo {
    // 基本信息
    Name: string; // 姓名
    MobilePhone: string; // 手机号
    Sex: number; // 性别
    Birthday: string; // 生日
    Industry: string; // 行业
    Profession: string; // 职业
    Income: string; // 月收入
    FamilyStructure: string; // 家庭结构
    HasHouse: boolean; // 是否购房
    IdCard: string; // 身份证

    // 潜客信息
    CarModel?: string; // 意向车型
    BuyTimeRange?: string; // 购车时间
    PriceRange?: string; // 购车预算
    Purchase?: string; // 购车性质
    KeepCarModel?: string; // 保有车型
    IsLoan?: boolean; // 是否贷款购车
    CarUsage?: string; // 车辆用途
    Purpose?: boolean[]; // 关注特点
    ContrastCarModel?: string; // 对比车型
    OrderDate?: string; // 订单时间
    DeliverDate?: string; // 交车时间

    /**
     * 选项配置项
     */
    SexOptions: string[]; // 性别配置项
    LastBirthday: string; // 最晚生日，今天
    HasHouseOptions: string[]; // 是否购房
    IsLoanOptions: string[]; // 是否带宽购车
    PurposeOptions: string[]; // 关注特性
}


const customerInfo: CustomerInfo = <CustomerInfo>{
    // 基本信息
    Name: 'Cphayim', // 姓名
    MobilePhone: '110 119 120', // 手机号
    Sex: 1, // 性别
    Birthday: '', // 生日
    Industry: '互联网', // 行业
    Profession: '程序猿', // 职业
    Income: '30k', // 月收入
    FamilyStructure: '妻妾成群', // 家庭结构
    HasHouse: true, // 是否购房
    IdCard: '000000000000000000', // 身份证

    // 潜客信息
    CarModel: '兰博基尼 LP-700', // 意向车型
    BuyTimeRange: '2017-08-01', // 购车时间
    PriceRange: '300万', // 购车预算
    Purchase: '', // 购车性质
    KeepCarModel: '三轮车', // 保有车型
    IsLoan: false, // 是否贷款购车
    CarUsage: '', // 车辆用途
    Purpose: [false, false, false, false, false, false, false], // 关注特点
    ContrastCarModel: '挖掘机', // 对比车型
    OrderDate: '2017-08-01', // 订单时间
    DeliverDate: '2018-08-01', // 交车时间
    // 老客信息    
}

customerInfo.SexOptions = ['未知', '男', '女'];
// 生日最晚为今天
customerInfo.LastBirthday = dateFormat('yyyy-MM-dd');
customerInfo.HasHouseOptions = ['未购房', '已购房'];
customerInfo.IsLoanOptions = ['是', '否'];
customerInfo.PurposeOptions = ['品牌', '外观', '动力', '操控', '舒适', '安全', '价格'];

interface Data {
    loaded: boolean; // 页面是否已首次加载完毕
}

class CustomerEditPage extends BasePage {
    private customerInfo: CustomerInfo = customerInfo;
    public data: Data = <Data>{
        loaded: false,
        customerInfo,
    }
    // 设置性别
    public setSex(e) {
        this.customerInfo.Sex = ~~e.detail.value;
        this.syncCustomerInfoToView();
    }
    // 设置生日
    public setBirthday(e) {
        customerInfo.Birthday = e.detail.value;
        this.syncCustomerInfoToView();
    }
    // 设置 “是否” 类型的选择
    public setFalseOrTrue(e) {
        let name: string = e.currentTarget.dataset.name; // 对应的 name
        let val: string = e.detail.value; // "0" 或 "1"
        // 拿到的是字符串 "0" 或 "1" ，转为整数，取 boolean
        customerInfo[name] = !!~~val;
        this.syncCustomerInfoToView();
    }
    // 设置关注特性
    public setPurpose(e) {
        const target = e.target,
            index = target.dataset.index,
            optionName = target.dataset.optionName;
        if (index === undefined || optionName === undefined) return;
        // 取反
        this.customerInfo.Purpose[index] = !this.customerInfo.Purpose[index];
        this.syncCustomerInfoToView();
    }

    // 同步客户信息到视图
    private syncCustomerInfoToView() {
        this.setData({
            customerInfo: this.customerInfo
        });
    }
    /**
     * 生命周期函数--监听页面加载
     */
    private onLoad(options) {
        let {
            flag
        } = options;
        let navigationTitle = '';
        if (flag == 'follow') {
            navigationTitle = '添加跟进记录';
        } else {
            navigationTitle = '完善客户资料';
        }
        wx.setNavigationBarTitle({
            title: navigationTitle
        });
        this.setData({
            flag,
            loaded: true,

            // 选项数据
            sexOptions: ['男', '女'],

        });
    }
    private onReady() { }
    private onShow() { }
    private onHide() { }
    private onUnload() { }
    private onPullDownRefresh() { }
    private onReachBottom() { }
    private onShareAppMessage() { }
}

Page(new CustomerEditPage());