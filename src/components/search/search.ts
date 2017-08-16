/* 
 * 搜索组件类
 * @Author: Cphayim
 * @Date: 2017-07-11 11:10:40 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-07-11 14:11:21
 */

// 外部搜索框

/**
 * tap 事件 跳转到 内部搜索页 (你需要导出这个函数绑定到 page 上)
 * @param {Object} e  
 */
export function openSearch(e) {
    // 没有事件对象跳出
    if (!e) return;
    // 参数获取
    const type = e.currentTarget.dataset.type,
        url = e.target.dataset.url;
    console.log(type,url);
    //页面跳转
    wx.navigateTo({
        url: `${url}?type=${type}`
    });
}
