import BasePage from '../../../basepage';
import { dateFormat } from '../../../../modules/util';
import { request } from '../../../../modules/request';
/*
 * 客户详情-编辑 逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-31 17:56:18 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 11:48:43
 */



const customerInfo: any = {
    // 基本信息
    Name: 'Cphayim', // 姓名
    MobilePhone: '110 119 120', // 手机号
    Sex: '0', // 性别
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
customerInfo.lastBirthday = dateFormat('yyyy-MM-dd');

class CustomerEditPage extends BasePage {
    public data: any = {
        loaded: false,
        customerInfo,
        array: ['美国', '中国', '巴西', '日本'],
        index: 0,
    }
    // 设置性别
    setSex(e) {
        console.log(e);
        customerInfo.Sex = e.detail.value
        this.syncCustomerInfoToView();
    }
    // 设置生日
    setBirthday(e) {
        customerInfo.Birthday = e.detail.value;
        this.syncCustomerInfoToView();
    }
    // 同步客户信息到视图
    private syncCustomerInfoToView() {
        this.setData({
            customerInfo
        })
    }
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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
    onReady() {

    }
    onShow() {

    }
    onHide() {

    }
    onUnload() {

    }
    onPullDownRefresh() {

    }
    onReachBottom() {

    }
    onShareAppMessage() {

    }
}

Page(new CustomerEditPage());