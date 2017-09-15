/*
 * 聊天界面逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-07 13:56:52 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-29 11:29:00
 */

import pagePath from '../../../../config/path.config'
import BasePage from '../../../basepage';
import toast from '../../../../modules/toast';

class ChatPage extends BasePage {
    private id: number = 0; // 客户 id

    private remindHeadHeight: number = 0; // 提醒条高度
    private toolsetHeightBase: number = 0; // 工具集基本高度 (onLoad 时计算得到)
    private toolsetHeightCur: number = 0; // 工具集当前高度 (每当工具集高度改变时重新计算该值)
    public data = {
        // 各页面路径
        pagePath,
        /**
         * 底部工具相关
         */
        // 输入框是否聚焦
        isFocus: false,
        // 是否为语音模式
        isIntercom: false,
        // 是否显示扩展盒子
        isShowExtend: false,
        /**
         * 内容视图相关
         */

        contentViewHeight: 0, // 内容滚动视图高度
        contentViewTranslate: 0, // 内容滚动视图Y轴偏移量
    }

    /**
     * 每次当工具集高度改变 (输入文字导致 textarea 增高降低、切换文本语音输入、打开表情、打开扩展)时
     * 都计算出当前工具集的高度 减去 工具集基础高度(load 时计算的值)，得到变化量
     * 通过变化量 改变 内容滚动视图容器的偏移量
     */


    // 输入框行变化

    /**
     * Textarea 行数变化
     * @param {any} e 
     * @returns 
     * @memberof ChatPage
     */
    public lineChange(e) {
        // 更新内容滚动区偏移
        /**
         * 延迟目的，因为 setData 和 setContentViewTranslate 内获取元素信息的方法都是异步调用
         * 可能因为先获取到了值，之后才 setData 改变了高度，导致布局出错
         */
        setTimeout(() => this.setContentViewTranslate(), 100)
    }
    
    /**
     * 切换输入模式，文字/语音
     * @param {any} e 
     * @memberof ChatPage
     */
    public toggleInputModel(e) {
        // 设置 Intercom 取反
        this.setData({ isIntercom: !this.data.isIntercom })
        // 如果 extend 扩展盒子是打开的顺带关闭它
        this.data.isShowExtend && this.toggleExtend();
        // 更新内容滚动区偏移
        /**
         * 延迟目的，因为 setData 和 setContentViewTranslate 内获取元素信息的方法都是异步调用
         * 可能因为先获取到了值，之后才 setData 改变了高度，导致布局出错
         */
        setTimeout(() => this.setContentViewTranslate(), 100)

    }
    // 切换扩展
    toggleExtend(e?) {
        const obj: any = {};
        if (this.data.isShowExtend) {
            obj.isShowExtend = false;
            if (e) { obj.isFocus = true; }
            this.setData(obj)
        } else {
            obj.isShowExtend = true
            this.setData(obj)
        }
    }
    // 输入框失焦
    blurTextarea(e) {
        this.setData({
            isFocus: false,
            isShowExtend: false
        })
    }
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.id = ~~options.id
        wx.setNavigationBarTitle({
            title: options.name || this.id
        })
        setTimeout(() => {
            this.setContentViewHeight();
        }, 200)
    }
    /**
     * 获取并设置 remindHeadHeight
     * 
     * 设置 remindHeadHeight 为 提醒条的高度，
     * 并返回 Promise 对象 resolve(height)
     * @private
     * @returns 
     * @memberof ChatPage
     */
    private getRemindHeadHeight() {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-remind-head').boundingClientRect(res => {
                this.remindHeadHeight = res.height
                resolve(res.height)
            }).exec()
        })
    }
    /**
     * 获取并设置 ToolsetHeightCur
     * 
     * 如果 first = true，将同时设置 ToolsetHeightBase
     * 返回 Promise 对象 resolve(height)
     * 
     * 如果 first = false, 将 Cur - Base 得到差值
     * 返回 Promise 对象 resolve(cur-base)
     * @private
     * @param {boolean} [first=false] 
     * @returns 
     * @memberof ChatPage
     */
    private getToolsetHeight(first: boolean = false) {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('.m-toolset').boundingClientRect(res => {
                if (first) {
                    // 同时设置 base 与 cur，resolve 高度
                    this.toolsetHeightBase = this.toolsetHeightCur = res.height
                    resolve(this.toolsetHeightCur)
                } else {
                    // 设置 cur，resolve cur 与 base 的差值(小于0取0);
                    this.toolsetHeightCur = res.height
                    if (!this.toolsetHeightBase) {
                        // 如果此时 toolsetHeightBase 没有值，将 toolsetHeightCur 赋给它
                        this.toolsetHeightBase = this.toolsetHeightCur
                    }
                    const distance = this.toolsetHeightCur - this.toolsetHeightBase
                    console.log('distance ' + distance);
                    resolve(distance >= 0 ? distance : 0)
                }
            }).exec()
        })
    }
    /**
     * 设置 contentViewTranslate 内容滚动视图容器偏移量
     * @private
     * @memberof ChatPage
     */
    private setContentViewTranslate() {
        this.getToolsetHeight() // Primise resolve(distance) // 差值
            .then((distance: number) => this.setData({ contentViewTranslate: distance }))
    }
    /**
     * 设置 contentViewHeight 内容滚动视图容器高度
     * @private
     * @memberof ChatPage
     */
    private setContentViewHeight() {
        const p1 = this.getToolsetHeight(true),
            p2 = this.getRemindHeadHeight()
        Promise.all([p1, p2]).then((results: any[]) => {
            let [toolsetHeight, remindHeadHeight] = results
            console.log(toolsetHeight, remindHeadHeight)
            this.setData({
                // 内容视图滚动容器高度 = 系统可用高度 - m-remind-head 高度 - m-toolset 高度
                contentViewHeight: wx.getSystemInfoSync().windowHeight - remindHeadHeight - toolsetHeight
            })
            console.log(wx.getSystemInfoSync().windowHeight + ' - ' + remindHeadHeight + ' - ' + toolsetHeight + ' = ' + (wx.getSystemInfoSync().windowHeight - remindHeadHeight - toolsetHeight));
        }).catch(reason => console.log(reason) || toast.showError('结构渲染出错'));
    }

    onShow() {

    }
    // 转到提醒界面
    gotoremind(e) {
        wx.navigateTo({
            url: pagePath['chat-remind'] + '?id=' + this.id
        });
    }
}

Page(new ChatPage());