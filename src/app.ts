/*
 * App 入口文件
 * @Author: 云程科技
 * @Date: 2017-07-27 10:31:12
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-13 21:20:15
 */
import __pagePath from './config/path.config'
import toast from './modules/toast';

class Application {
    public toast: any;
    public __pagePath: any;
    public globalData: any = {
        ticket: wx.getStorageSync('ticket')
    };
    private getUserInfo(cb: (arg1: any) => void) {
        let that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: true,
                success(res) {
                    // console.log(res);
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    }
    public onLaunch() {
        // 获取 基础库版本号 和 微信版本号
        const { SDKVersion, version: wxVersion } = wx.getSystemInfoSync();

        // 基础库版本号提示
        if (SDKVersion > '1.4.0') {
            toast.showSuccess(`基础库版本: ${SDKVersion} 检测通过`);
        } else {
            toast.showError(`基础库版本: ${SDKVersion} 版本过低，请更新微信`);
        }
        
        this.getUserInfo((userInfo) =>  {
            console.log(userInfo);
        })
    }
    constructor() {
        this.toast = toast;
        this.__pagePath = __pagePath;
    }
}
App(new Application());
