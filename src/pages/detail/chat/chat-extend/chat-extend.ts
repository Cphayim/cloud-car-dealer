/*
 * 聊天界面扩展工具逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-13 10:03:42 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 12:41:35
 */


// 临时数据
import tempData from './tempdata'
import TabSlider from '../../../../components/tab-slider/tab-slider';
import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';

const tabSlider = new TabSlider({});
class ChatExtendPage extends BasePage {
    private tabSlider = tabSlider;
    public data = {
        tabSlider
    }
    changeSlider(e) {
        this.tabSlider.changeSlider(e);
    }
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 修改导航栏标题
        wx.setNavigationBarTitle({
            title: decodeURI(options.nav)
        });
        //
        new Promise((resolve, reject) => {
            // 服务器模拟
            // wx.request({
            //     url: 'http://127.0.0.1:3000/extend',
            //     method: 'get',
            //     data: {
            //         cat: options.cat
            //     },
            //     success(res) {
            //         resolve(res.data);
            //     },
            //     fail(res) {
            //         console.log(res);
            //         reject('网络请求失败');
            //     }
            // });
            // 本地
            resolve(tempData[options.cat]);
        }).then(data => {
            // 服务器模拟
            // _tabSlider.update(data.sliderData);
            // 本地
            this.tabSlider.update(data);
        }).catch(errmsg => {
            toast.showError(errmsg, 2000, true);
            setTimeout(function () {
                wx.navigateBack();
            }, 2000);
        })
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
Page(new ChatExtendPage());