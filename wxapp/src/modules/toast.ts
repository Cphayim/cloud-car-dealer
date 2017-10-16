/*
 * wx toast 提示层增强
 * @Author: Cphayim
 * @Date: 2017-07-26 09:44:52 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-29 11:10:41
 */

const path = '/assets/toast-icons';

class Toast {
    private iconPath: string;
    constructor(path: string = '/assets/toast-icons') {
        if (!/\/$/.test(path)) {
            path += '/';
        }
        this.iconPath = path;
    }
    /**
     * 显示 loadding(等待) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=10000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showLoading(title: string = '', mask: boolean = false) {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title, mask,
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            });
        })
    }
    /**
     * 显示 success(成功) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=2000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showSuccess(title: string = '', duration: number = 2000, mask: boolean = false) {
        const image: string = this.iconPath + 'toast-success.png';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 warning(警告) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=2000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showWarning(title: string = '', duration: number = 2000, mask: boolean = false) {
        const image: string = '/assets/toast-icons/toast-warning.png';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 error(错误) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=4000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showError(title: string = '', duration: number = 4000, mask: boolean = false) {
        const image: string = '/assets/toast-icons/toast-error.png';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 voiced(有声的) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=2000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showVoiced(title: string = '', duration: number = 2000, mask: boolean = false) {
        const image: string = '/assets/toast-icons/toast-voiced.png';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 voicing(正在录音) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=10m] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showVoicing(title: string = '', duration: number = 10*60*1000, mask: boolean = false) {
        const image: string = '/assets/toast-icons/toast-voicing.gif';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 cancel(取消) toast
     * @param {string} [title=''] 显示的文本
     * @param {number} [duration=2000] 持续时间 
     * @param {boolean} [mask=false] 是否遮罩(透明层)
     * @returns 返回 promise 对象
     */
    public showCancel(title: string = '', duration: number = 2000, mask: boolean = false) {
        const image: string = '/assets/toast-icons/toast-cancel.png';
        return this.show({
            title, duration, mask, image
        });
    }
    /**
     * 显示 toast
     * @param {Object} 解构对象 {title='',duration=10000,mask=false,icon="success",image=''} 
     * @returns 返回 promise 对象 
     */
    private show({ title = '', duration = 10000, mask = false, icon = "none", image = '' }: any) {
        return new Promise((resolve, reject) => {
            wx.showToast({
                title, icon, image, duration, mask,
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            })
        });
    }
    /**
     * 隐藏 toast
     */
    public hide() {
        wx.hideToast();
    }
}

const toast = new Toast(path);

export default toast