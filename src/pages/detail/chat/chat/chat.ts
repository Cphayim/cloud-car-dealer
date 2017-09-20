/*
 * 聊天界面逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-07 13:56:52 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-20 15:04:58
 */

import pagePath from '../../../../config/path.config'
import BasePage from '../../../basepage'
import toast from '../../../../modules/toast';
import { request, uploadFile, downloadFile } from '../../../../modules/request';
import { domain } from '../../../../config/config';
import { resCodeCheck } from '../../../../modules/auth'
import { dateFormat, extend } from '../../../../modules/util';
import { modal } from '../../../../modules/modal'
import { cywxImage } from '../../../../modules/image';

export class ChatPage extends BasePage {
    private isRefresh: boolean = false
    private isVoicing: boolean = false // 是否正在录音
    private id: number = 0 // 客户 id
    /**
     * 视图参数
     */
    private remindHeadHeight: number = 0 // 提醒条高度
    private toolsetHeightBase: number = 0 // 工具集基本高度 (onLoad 时计算得到)
    private toolsetHeightCur: number = 0 // 工具集当前高度 (每当工具集高度改变时重新计算该值)
    /**
     * 请求参数
     */
    private pageNo: number = 0
    private pageSize: number = 20

    private sTLock: boolean = false // 顶部加载锁，防止连续触发

    public data = {
        loaded: false,
        // 各页面路径
        pagePath,

        id: 0,

        isFocus: false,// 输入框是否聚焦
        isIntercom: false,// 是否为语音模式
        isShowExtend: false,// 是否显示扩展盒子
        extendIndex: 0, // 0 表情 1 扩展
        contentViewHeight: 0, // 内容滚动视图高度
        contentViewTranslate: 0, // 内容滚动视图Y轴偏移量
        scrollTop: 0,
        anchorId: 0,

        noMoreContent: false,
        messageData: [], // 消息数据
        textContent: '', // 输入框内容
    }

    /**
     * !(该方案暂时取消，textarea 存在 bug，等腾讯修复)
     * 每次当工具集高度改变 (输入文字导致 textarea 增高降低、切换文本语音输入、打开表情、打开扩展)时
     * 都计算出当前工具集的高度 减去 工具集基础高度(load 时计算的值)，得到变化量
     * 通过变化量 改变 内容滚动视图容器的偏移量
     */

    private onLoad(options) {

        this.id = ~~options.id
        this.setData({
            id: this.id
        })
        wx.setNavigationBarTitle({
            title: options.name || this.id
        })
        setTimeout(() => {
            this.setContentViewHeight()
        }, 200)
        this.loadData(true)
    }
    private onShow() {
        if (this.isRefresh) {
            this.isRefresh = false
            // 重置 noMoreContent
            this.data.noMoreContent = false
            this.loadData(true, true)
        }
    }

    /**
     * 加载数据(历史数据)
     * unshift -> messageData
     * @private
     * @param {boolean} [isScrollBt=false] 是否滚动到底部
     * @param {boolean} [isReset=false] 是否重置已有数据
     * @memberof ChatPage
     */
    private loadData(isScrollBt: boolean = false, isReset: boolean = false) {
        // 如果上次请求标记了没有更多内容，退出
        if (this.data.noMoreContent) { return }
        toast.showLoading('', true)
        // 如果需要重置列表
        if (isReset) {
            // 清空列表
            this.data.messageData = []
            this.pageNo = 0
        }
        this.pageNo++
        request({
            url: domain + '/WX/Message/ReadForHistory',
            data: {
                CustomerId: this.id,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            let data = res.data
            // 如果 data 不是数组 或 数组长度为 0，退出
            if (!(data instanceof Array) || !data.length) {
                this.setData({
                    noMoreContent: true
                })
                toast.showWarning('没有数据了', 1000)
                return
            }
            // 记录之前第一个 Id 作为锚点，第一次加载时不保存
            const anchorId = this.data.messageData.length ? `a${this.data.messageData[0].Id}` : `a0`
            console.log('锚点' + anchorId)
            // 返回的是倒序结构，反向排序处理
            data.reverse()
            // 内容处理
            data = data.map(item => {
                // 处理内容中的 html 标签
                item.Content = item.Content.replace(/<[^>]+>/g, "")
                // 处理 json 字符串
                if (item.ContentType == 7) {
                    item.Content = JSON.parse(item.Content)
                }
                return item
            })
            // unshift 到 messageData 中
            this.data.messageData.unshift(...data)
            this.setData({
                messageData: this.data.messageData,
                // anchorId: anchorId,
            })
            setTimeout(() => {
                this.setData({
                    anchorId: anchorId,
                })
            }, 600)
            setTimeout(() => toast.hide(), 800)
            if (isScrollBt) {
                this.scrollToBt()
                setTimeout(() => this.setData({
                    loaded: true
                }), 100)
            }
        })
    }
    /**
     * 插入新消息
     * @private
     * @param {any} data 
     * @memberof ChatPage
     */
    private insertNewData(data: any[] = [], ) {
        if (!(data instanceof Array) || !data.length) { return }
        // 返回的是倒序结构，反向排序处理
        data.reverse()
        // 内容处理
        data = data.map(item => {
            // 处理内容中的 html 标签
            item.Content = item.Content.replace(/<[^>]+>/g, "")
            // 处理 json 字符串
            if (item.ContentType == 7) {
                item.Content = JSON.parse(item.Content)
            }
            return item
        })
        // unshift 到 messageData 中
        this.data.messageData.push(...data)
        this.setData({
            messageData: this.data.messageData,
        })
        this.scrollToBt()
    }
    /**
     * 滚动到底部
     * @private
     * @returns 
     * @memberof ChatPage
     */
    private scrollToBt() {
        const messageData = this.data.messageData
        const anchorId = `a${messageData[messageData.length - 1].Id}`
        this.setData({
            anchorId: anchorId
        })
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
     * 获取 高度/偏移量，并设置 ToolsetHeightCur
     * 
     * 如果 first = true，将同时设置 ToolsetHeightBase
     * 返回 Promise 实例 resolve(height)
     * 
     * 如果 first = false, 将 Cur - Base 得到差值
     * 返回 Promise 实例 resolve(cur-base)
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
                    // 设置 cur
                    this.toolsetHeightCur = res.height
                    if (!this.toolsetHeightBase) {
                        // 如果此时 toolsetHeightBase 没有值，将 toolsetHeightCur 赋给它
                        this.toolsetHeightBase = this.toolsetHeightCur
                    }
                    const distance = this.toolsetHeightCur - this.toolsetHeightBase
                    // console.log('distance ' + distance)
                    // resolve cur 与 base 的差值(小于0取0)
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
    // private setContentViewTranslate() {
    //     this.getToolsetHeight() // Primise resolve(distance) // 差值
    //         .then((distance: number) => this.setData({ contentViewTranslate: distance }))
    // }
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
            // console.log(wx.getSystemInfoSync().windowHeight + ' - ' + remindHeadHeight + ' - ' + toolsetHeight + ' = ' + (wx.getSystemInfoSync().windowHeight - remindHeadHeight - toolsetHeight))
        }).catch(reason => console.log(reason) || toast.showError('结构渲染出错'))
    }

    // 转到提醒界面
    public gotoremind(e) {
        wx.navigateTo({
            url: pagePath['chat-remind'] + '?id=' + this.id
        })
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
        this.data.isShowExtend && this.toggleExtend(null, true);
    }
    /**
     * 输入框聚焦
     * @param {any} [e] 
     * @memberof ChatPage
     */
    public textFocus(e) {
        // this.data.isShowExtend && this.toggleExtend(null, true);
    }
    /**
     * 切换扩展
     * @param {any} [e] 
     * @memberof ChatPage
     */
    public toggleExtend(e, close: boolean = false) {
        // 如果 close 参数为 true 或不存在 e，直接隐藏盒子
        if (close || !e) {
            this.setData({
                isShowExtend: false,
            });
            return;
        }
        // 获取 data-extend-index 的值
        let { extendIndex } = e.currentTarget.dataset;
        extendIndex = ~~extendIndex;
        // 如果当前盒子为显示状态 且 显示的是点击的盒子，关闭它
        if (this.data.isShowExtend && this.data.extendIndex === extendIndex) {
            this.setData({
                isShowExtend: false
            })
        }
        // 当前盒子为隐藏状态 或 (当前盒子为显示状态 但 this.data.extendIndex 不等于 extendIndex)
        else {
            this.setData({
                isShowExtend: true,
                extendIndex: extendIndex
            })
        }
    }
    /**
     * 输入框失焦
     * @param {any} e 
     * @memberof ChatPage
     */
    public blurTextarea(e) {
        this.setData({
            isFocus: false,
            isShowExtend: false
        })
    }
    /**
     * 内容滚动视图下拉加载历史消息
     * @private
     * @memberof ChatPage
     */
    private scrollToupper() {
        if (this.sTLock) { return }
        this.sTLock = true
        this.loadData()
        setTimeout(() => this.sTLock = false, 600)
    }
    /**
     * 同步输入框内容
     * @private
     * @memberof ChatPage
     */
    private syncTextContent(e) {
        this.data.textContent = e.detail.value
    }
    /**
     * 图片预览，点击查看大图
     * @memberof ChatPage
     */
    public previewImage(e) {
        const { url } = e.currentTarget.dataset
        if (!url) { return }
        wx.previewImage({
            urls: [url]
        })
    }

    /**
     * 发送文字对话
     * @param {any} e 
     * @memberof ChatPage
     */
    public sendTextContent(e) {
        if (/^\s*$/.test(this.data.textContent)) {
            modal.show({
                title: '',
                content: '不能发送空白文字',
                showCancel: false,
                confirmText: '确定'
            })
            return
        }
        toast.showLoading('发送中...', true)
        request({
            url: domain + '/WX/Message/Send',
            data: {
                customerId: this.id,
                contentType: 1,
                IsAllowSuperSend: true,
                content: this.data.textContent
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            this.insertNewData([res.data])
            this.setData({
                textContent: ''
            })
            toast.hide()
        })
    }
    /**
     * 开始录音
     * @param {any} e 
     * @memberof ChatPage
     */
    public voiceBegin(e) {
        console.log('按下');
        wx.downloadFile({
            url: 'http://admin.vcar360.com/App_Content/Theme/OAv2/js/prompt.mp3',
            success(res) {
                console.log(res);
                const { tempFilePath } = res;
                wx.playVoice({
                    filePath: tempFilePath,
                    success(res) {
                        console.log(res);
                    },
                    fail(res) {
                        console.log(res);
                    }
                })
            },
            fail(res) {
                console.log(res);
            }
        })
        // if (this.isVoicing) { return }
        // this.isVoicing = true
        // const id = this.id;
        // wx.startRecord({
        //     success(res) {
        //         const { tempFilePath } = res;
        //         console.log(tempFilePath);
        //         wx.uploadFile({
        //             url: domain + '/WX/Message/Send',
        //             filePath: tempFilePath,
        //             name: 'httpPostedFile',
        //             header: {
        //                 'X-Requested-With': 'XMLHttpRequest'
        //             },
        //             formData: {
        //                 ticket: wx.getStorageSync('ticket'),
        //                 customerId: id,
        //                 contentType: 5,
        //                 IsAllowSuperSend: true
        //             },
        //             success(res) {
        //                 console.log(res);
        //             }
        //         })
        //     },
        //     fail(res) {
        //         console.log(res);
        //         toast.showError('录音失败，没有权限')
        //     }
        // })
    }
    public voiceEnd(e) {
        console.log('放开');
        // wx.stopRecord();
        // setTimeout(() => {
        //     this.isVoicing = false
        // }, 1000);
    }

    /**
     * 发送表情
     * @param {any} e
     * @memberof ChatPage
     */
    public sendFace(e) {
        const { imgUrl } = e.currentTarget.dataset;
        // console.log(imgUrl);
        toast.showLoading('发送中...');
        request({
            url: domain + '/WX/Message/Send',
            data: {
                customerId: this.id,
                contentType: 4,
                IsAllowSuperSend: true,
                content: imgUrl
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            this.insertNewData([res.data])
            this.setData({
                textContent: ''
            })
            toast.hide()
        })
    }
    /**
     * 选择照片
     * @memberof ChatPage
     */
    public choosePhoto() {
        // 选择图片
        cywxImage.choose({
            count: 1, // 暂时只支持单张上传
        }).then((res: any) => {
            const { tempFilePaths } = res;
            // console.log(tempFilePaths);
            // 如果没有选择，退出
            if (!tempFilePaths[0]) { return; }
            toast.showLoading('发送中...')
            console.log(tempFilePaths[0]);
            uploadFile({
                url: domain + '/WX/Message/Send',
                filePath: tempFilePaths[0],
                name: 'httpPostedFile',
                header: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                formData: {
                    ticket: wx.getStorageSync('ticket'),
                    customerId: this.id,
                    contentType: 4,
                    IsAllowSuperSend: true
                }
            }).then(res => {
                if (resCodeCheck(res)) { return; }
                toast.showSuccess('发送成功');
                this.loadData(true, true);
            })
        });
    }
}

Page(new ChatPage())