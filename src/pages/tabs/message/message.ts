/*
 * Tab 消息页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:54 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-07-31 18:08:08
 */

// 路径模块
import pagePath from '../../../config/path.config'
// 搜索入口组件
import { openSearch } from '../../../components/search/search'
import { extend } from '../../../modules/util';
import BasePage from '../../basepage';

const msgList = [];

for (let i = 0; i < 6; i++) {
    let obj: any = {};
    obj.id = ~~(Math.random() * 10000);
    obj.realname = obj.username = `第${i + 1}位客户`;
    obj.avatarUrl = 'https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg';
    obj.lastMsg = `与第${i + 1}位客户的最后一条消息`.repeat(i + 1);
    obj.time = '18:30';
    msgList.push(obj);
}

class MessagePage extends BasePage {
    public data:any = {
        msgList
    }
    // 搜索组件入口 方法挂载
    public openSearch = openSearch;
    constructor() {
        super();
    }
    // 跳转到对话详情
  toDetail(e){
    console.log(e);
    const id = e.currentTarget.dataset.clientId;
    console.log(id);
    wx.navigateTo({
      url: `${pagePath.dialogue}?id=${id}`,
    })
  }
  /**
   * 生命周期
   */
  onLoad(options) {

  }
  onReady() {

  }
  onShow() {

  }
  onHide() {

  }
  onUnload() {

  }
  onPullDownRefresh() {

  }
  onReachBottom() {

  }
  onShareAppMessage() {

  }
}
Page(new MessagePage());
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     msgList
//   },

//   // 搜索组件方法挂载
//   openSearch,
//   // 跳转到对话详情
//   toDetail(e){
//     console.log(e);
//     const id = e.currentTarget.dataset.clientId;
//     console.log(id);
//     wx.navigateTo({
//       url: `${__pagePath.dialogue}?id=${id}`,
//     })
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoadpagePath(options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReadypagePath() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShowpagePath() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHidepagePath() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnloadpagePath() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefreshpagePath() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottompagePath() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessagepagePath() {

//   }
// })