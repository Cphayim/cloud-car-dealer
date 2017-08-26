import toast from './toast';
/*
 * 网络请求库
 * @Author: Cphayim
 * @Date: 2017-07-31 14:41:23 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-13 20:12:15
 */

export function request({
    url,
    method = 'post',
    header = {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded'
    },
    data = {},
    dataType = 'json',
}) {
    if (!url) throw Error('没有传入 URL');
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            header,
            data,
            dataType,
            success(res) {
                resolve(res.data);
            },
            fail(res) {
                console.log(res);
                toast.showError('网络请求失败!');
            }
        });
    });
}