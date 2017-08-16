import BasePage from '../basepage';
import pagePath from '../../config/path.config';
import toast from '../../modules/toast';
import { domain } from '../../config/url.config';
import { request } from '../../modules/request';

/**
 * 启动与登录页
 * @class WelcomePage
 * @extends {BasePage}
 */
class WelcomePage extends BasePage {
    // 数据容器
    public data: any = {
        app: getApp(),
        loaded: false, // 页面是否加载完毕(动画相关)
        isShowLogin: false, // 是否显示登录框
        focusTo: 0, // 0: 无，1: 拉起账号输入框键盘，2: 拉起密码输入框键盘
        formData: {} // 表单数据
    }
    /**
     * 输入框 blur 事件
     * @private
     * @param {*} e 
     * @memberof WelcomePage
     */
    private inputBlur(e: any): void {
        let key: string = e.target.dataset.name;
        let val: string = e.detail.value;
        this.data.formData[key] = val;
        console.log(this.data.formData);
    }
    /**
     * 输入框确认事件(手机端有效)
     * @private
     * @param {*} e 
     * @memberof WelcomePage
     */
    private inputConfirm(e: any): void {
        // 如果事件目标为 账号输入框，激活密码输入框拉起键盘
        if (e.target.dataset.name == 'UserName') {
            this.setData({
                focusTo: 2
            });
        }
    }
    /**
     * 提交登录
     * @private
     * @returns 
     * @memberof WelcomePage
     */
    private login(): void {
        // 获取表单数据
        const formData = this.data.formData;
        // 判断数据是否完整
        if (!formData.UserName) {
            toast.showWarning('请输入用户名', 2000);
            return;
        } else if (!formData.Password) {
            toast.showWarning('请输入密码', 2000);
            return;
        }

        // 发送请求
        new Promise((resolve, reject) => {

            toast.showLoading('正在登录...');

            request({
                url: `${domain}/pages/applogin`,
                data: formData
            }).then(res => {
                console.log(res);
                resolve(res);
            }).catch(err => {
                toast.showError('连接失败，请检查网络');
                console.log(err);
            });
        }).then((res: any) => {

            // 响应成功
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 登录成功
                    if (!res.errorcode) {
                        resolve(res.data);
                    }
                    // 登录失败 
                    else {
                        reject(res.errormsg);
                    }
                }, 300);
            });
        }).then((data: any) => {
            // 登录成功
            toast.showSuccess('登录成功', 1000);
            // 缓存登录凭证
            wx.setStorageSync('ticket', data.ticket);
            // 缓存员工信息
            wx.setStorageSync('employee', data.employee);

            // 跳转到首页
            setTimeout(_ => {
                wx.switchTab({
                    url: pagePath.home
                });
            }, 1000);
        }).catch(errormsg => {
            // 登录失败，提示内容
            toast.showWarning(errormsg, 2000);
        });
    }

    /**
     * 生命周期相关
     * @memberof WelcomePage
     */
    private onLoad(options): void {
        const p1 = new Promise((resolve, reject) => {
            // 动画
            setTimeout(_ => {
                this.setData({
                    loaded: true
                });
                resolve();
            }, 500);
        }).then(() => {
            return new Promise((resolve, reject) => {
                // 检测登录状态
                const ticket = wx.getStorageSync('ticket');
                if (ticket) {
                    resolve();
                } else {
                    reject();
                }
            });
        }).then(() => {
            console.log(1)
            // 已登录 转到首页
            setTimeout(() => {
                wx.switchTab({
                    url: pagePath.home,
                    success(e) {
                        console.log(e);
                    },
                    fail(err) {
                        console.log(err);
                    }
                });
            }, 2000);
        }).catch(() => {
            console.log(2)
            // 未登录 调出登录框
            setTimeout(() => {
                this.setData({
                    isShowLogin: true
                });
            }, 600);
        });
    }
    onReady(): void { }
    onShow(): void { }
    onHide(): void { }
    onUnload(): void { }
    onPullDownRefresh(): void { }
    onReachBottom(): void { }
    onShareAppMessage(): void { }
}

Page(new WelcomePage());