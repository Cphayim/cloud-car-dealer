/*
 * 模态框
 * @Author: Cphayim
 * @Date: 2017-08-10 22:25:14 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-19 09:16:10
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
                    /**
                     * 点击确定按钮        res.confirm 为 true, res.cancel 为 false
                     * 点击取消按钮        res.confirm 为 false, res.cancel 为 true
                     * 点击遮罩层(安卓)    res.confirm 为 false, res.cancel 为 false (此时应同取消逻辑)
                     */
                    if (res.confirm) {
                        // 用户点击了确定
                        resolve(true);
                    } else {
                        // 用户没有点击确定--点了取消或点了遮罩(安卓)
                        resolve(false);
                    }
                },
                fail(err) {
                    console.error(err);
                    reject(err);
                }
            });
        });

    }
}