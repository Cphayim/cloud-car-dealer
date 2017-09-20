import toast from './toast';
/*
 * 网络请求库
 * @Author: Cphayim
 * @Date: 2017-07-31 14:41:23 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-08 17:40:54
 */

// http 请求
export function request({
    url,
    method = 'post',
    header = {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded'
    },
    data = {},
    dataType = 'json',
    second = false
}: {
        url: string; method?: string; header?: any; data?: any; dataType?: string; second?: boolean;
    }) {
    if (!url) throw Error('没有传入 URL');

    /**
     * data 内层是对象的话，拍平
     * 转为一下形式
     * data = {
     *  'Name': 'SQL',
     *  'CustomerPre.IsLoan': true
     * }
     */
    if (second) {
        for (let k in data) {
            // 如果是对象
            if (typeof data[k] === 'object') {
                for (let ck in data[k]) {
                    data[k + '.' + ck] = data[k][ck];
                }
                delete data[k];
            }
        }
    }
    // 获取 tikcet
    data.ticket = wx.getStorageSync('ticket');
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
                toast.showError('网络请求失败! 错误状态码:' + res.statusCode);
            }
        });
    });
}

// 文件上传请求
export function uploadFile({ url, filePath, name, header = {}, formData = {} }:
    { url: string, filePath: string, name: string, header?: any, formData?: any }) {
    if (!url || !filePath || !name) {
        throw Error('uploadFile 参数缺失');
    }
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url, filePath, name, header, formData,
            success(res) {
                if (res.statusCode !== 200) {
                    toast.showError('上传失败');
                    return;
                }
                resolve(res);
            },
            fail(res) {
                console.log(res);
                toast.showError('上传失败');
            }
        });
    });
}

// 文件下载
export function downloadFile({ url, header = {} }) {
    if (!url) {
        throw Error('downloadFile 参数缺失');
    }
    return new Promise((resolve, reject) => {
        wx.downloadFile({
            url, header,
            success(res) {
                if (res.statusCode !== 200) {
                    console.log('下载失败');
                    console.log(res.statusCode);
                    return;
                }
                resolve(res);
            },
            fail(res) {
                console.log(res);
                console.log('下载失败');
            }
        })
    });
}