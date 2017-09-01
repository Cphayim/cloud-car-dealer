import pagePath from '../config/path.config';
import toast from './toast';

/**
 * 认证模块
 */

export const reLogin = (): void => {
    // 清除ticket信息
    wx.removeStorageSync('ticket');
    // 清除员工信息
    wx.removeStorageSync('employee');
    // 清除经销商信息
    wx.removeStorageSync('tenant');
    // 重定向到登录页
    wx.redirectTo({
        url: pagePath.welcome + '?overdue=1'
    });
}

/**
 * 返回 code 鉴定
 * @param res 
 */
export const resCodeCheck = (res: any): boolean => {
    if (res.errorcode === 0) {
        return false;
    }
    // ticket 无效
    else if (res.errorcode === 40001) {
        reLogin();
        return true;
    }

    if (res.errormsg) {
        toast.showWarning(res.errormsg);
    } else {
        toast.showError('未返回数据');
    }

    return true;
}

