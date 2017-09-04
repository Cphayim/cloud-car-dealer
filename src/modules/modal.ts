/*
 * 模态框
 * @Author: Cphayim
 * @Date: 2017-08-10 22:25:14 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-10 22:37:14
 */
export const modal = {
    show({
        title = '提示',
        content = '提示内容',
        showCancel = true,
        cancelText = '取消',
        cancelColor = '#333',
        confirmText = '确定',
        confirmColor = '#54b4ef'
     }) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor,
                success(res) {
                    if (res.confirm) {
                        resolve(true);
                    } else if (res.cancel) {
                        resolve(false);
                    }
                },
                fail(err) {
                    console.log(err);
                }
            });
        });

    }
}