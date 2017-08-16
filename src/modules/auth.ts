import pagePath from '../config/path.config';
import toast from './toast';

export const resCodeCheck = (res: any): boolean => {
    if (res.errorcode === 0) {
        return false;
    }
    // ticket 无效
    else if (res.errorcode === 40001) {
        // 清除登录信息
        wx.removeStorageSync('ticket');
        wx.removeStorageSync('employee');
        // 重定向到登录页
        wx.redirectTo({
            url: pagePath.welcome + '?overdue=true'
        });
        return true;
    }
    toast.showWarning(res.errormsg);
    return true;
}