import BasePage from '../../../basepage';
/*
 * 聊天界面-提醒逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-18 10:26:26 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 13:01:12
 */

class ChatRemindPage extends BasePage {
  public data: any = {
    // 列表底部填充层高度
    paddingLayerHeight: 0,
    remindList: [{
      realname: '朱立俊',
      username: '老村夫',
      role: '全干(zhàn)架构师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1467.JPG'
    },
    {
      realname: '佳衡',
      username: 'Cphayim',
      role: '前端开发工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/cphayim-avatar-2017.jpg'
    },
    {
      realname: '泽凯',
      username: 'Kyle萧萧',
      role: 'UI设计师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1465.JPG'
    },
    {
      realname: '叶梓',
      username: '迎風别葉index',
      role: '网络运维工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1463.JPG'
    }, {
      realname: '右晨',
      username: '守心',
      role: 'Java开发工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1464.JPG'
    },
    {
      realname: '文龙',
      username: '',
      role: 'iOS开发工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1470.PNG'
    },
    {
      realname: '惠铭',
      username: '毛头小子‘’',
      role: '前端开发工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1469.JPG'
    },
    {
      realname: '圣平',
      username: '奔跑',
      role: 'PHP开发工程师',
      avatar: 'http://ofwf89b21.bkt.clouddn.com/avatar/IMG_1466.JPG'
    }
    ]
  }
  // 设置列表视图滚动容器高度
  setPaddingLayerHeight() {
    wx.createSelectorQuery().select('.m-remind-btn').boundingClientRect(res => {
      this.setData({
        paddingLayerHeight: res.height
      })
    }).exec();
  }
  onLoad(options) {
    this.setPaddingLayerHeight();
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
Page(new ChatRemindPage());