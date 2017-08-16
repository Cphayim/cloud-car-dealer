/*
 * 聊天界面逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-07 13:56:52 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 13:16:11
 */

import pagePath from '../../../config/path.config'
import BasePage from '../../basepage';

class dialoguePage extends BasePage {
    public data: any = {
        // 各页面路径
        pagePath,
        /**
         * 底部工具相关
         */
        // 输入框高度
        textareaHeight: 40,
        // 输入框是否聚焦
        isFocus: false,
        // 是否为语音模式
        isIntercom: false,
        // 是否显示扩展盒子
        isShowExtend: false,
        /**
         * 内容视图相关
         */
        // 内容滚动视图高度
        contentViewHeight: 0
    }
    // 关闭提示
    closeTip(e) {
        this.setData({
            isShowTip: false
        });
    }
    // 输入框行变化
    lineChange(e) {
        // 解构赋值
        let {
            height,
            heightRpx,
            lineCount,
        } = e.detail;
        // 最多显示4行高度
        if (lineCount > 5) {
            return;
        }
        if (lineCount == 1) {
            heightRpx = 40;
        }
        // 修改输入框高度
        this.setData({
            textareaHeight: height
        });

        // 更新内容滚动区高度
        setTimeout(_ => {
            this.setContentViewHeight();
        }, 100);
    }
    // 切换输入模式, 文字输入/语音对讲
    toggleInputModel(e) {
        this.setData({
            isIntercom: !this.data.isIntercom
        });
        this.data.isShowExtend && this.toggleExtend();
        // 更新内容滚动区高度
        this.setContentViewHeight();
    }
    // 切换扩展
    toggleExtend(e?) {
        const obj:any = {};
        if (this.data.isShowExtend) {
            obj.isShowExtend = false;
            if (e) obj.isFocus = true;
            this.setData(obj);
        } else {
            obj.isShowExtend = true;
            this.setData(obj);
        }
    }
    // 输入框失焦
    blurTextarea(e) {
        this.setData({
            isFocus: false,
            isShowExtend: false
        })
    }
    // 设置 内容视图滚动容器 高度
    setContentViewHeight() {
        console.log('开始设置 contentViewHeight')
        // 获取 m-toolset 工具集高度
        const p1 = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-toolset').boundingClientRect(res => {
                this.setData({
                    toolsetHeight: res.height
                });
                resolve(res.height);
            }).exec();
        });

        // 获取 m-remind-head 提醒条高度
        const p2 = new Promise((resolve, reject) => {
            if (this.data.remindHeadHeight) {
                resolve(this.data.remindHeadHeight);
            }
            wx.createSelectorQuery().select('.m-remind-head').boundingClientRect(res => {
                this.setData({
                    remindHeadHeight: res.height
                });
                resolve(res.height);
            }).exec();
        });

        // 并行处理异步操作
        Promise.all([p1, p2]).then((results:any[]) => {

            let [toolsetHeight, remindHeadHeight] = results;
            console.log(toolsetHeight, remindHeadHeight)
            this.setData({
                // 内容视图滚动容器高度 = 系统可用高度 - m-remind-head 高度 - m-toolset 高度
                contentViewHeight: wx.getSystemInfoSync().windowHeight - remindHeadHeight - toolsetHeight
            });
            console.log(wx.getSystemInfoSync().windowHeight + ' - ' + remindHeadHeight + ' - ' + toolsetHeight + ' = ' + (wx.getSystemInfoSync().windowHeight - remindHeadHeight - toolsetHeight));
        }).catch(reason => {
            console.log(reason);
        });
    }

    // 转到提醒界面
    gotoremind(e) {
        wx.navigateTo({
            url: pagePath.remind
        });
    }
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(urlQuery) {
        // 更新导航栏标题
        this.setData({
            clientId: decodeURI(urlQuery.id)
        });
        wx.setNavigationBarTitle({
            title: this.data.clientId
        });
    }
    onReady() { }
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

Page(new dialoguePage());