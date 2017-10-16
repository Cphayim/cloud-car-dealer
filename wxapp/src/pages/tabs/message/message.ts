import BasePage from '../../basepage';
import pagePath from '../../../config/path.config';
import Search from '../../../components/search/search';
import toast from '../../../modules/toast';
import { domain, maxPageSize } from '../../../config/config';
import { listTimeFormat } from '../../../modules/util';
import { refreshDelay } from '../../../config/config';
import { request } from '../../../modules/request';
import { resCodeCheck } from '../../../modules/auth';
/*
 * Tab 消息页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:54 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-22 11:22:07
 */
class MessagePage extends BasePage {

    private search: Search = new Search()

    private PageSize: number = 20 // 请求item数量
    private PageNo: number = 0 // 请求页码
    private MultiWord: string = '' // 搜索关键字

    public data = {
        loaded: false,
        search: this.search,

        listPaddingTop: 0,
        messageList: []
    }
    private onLoad(options) {
        this.search.init();
        wx.createSelectorQuery().select('.m-search').boundingClientRect(rect => {
            this.setData({
                listPaddingTop: rect.height
            })
        }).exec()
        this.addListItem()
    }

    /**
     * 加载数据
     * @private
     * @param {boolean} [isRefresh=false] 是否刷新
     * @memberof MessagePage
     */
    private addListItem(isRefresh = false) {
        toast.showLoading()

        // 如果是刷新操作，清空列表
        if (isRefresh) {
            this.PageNo = 0
            this.data.messageList = []
        }

        this.PageNo++
        request({
            url: domain + '/WX/Message/ReadForGroup',
            data: {
                PageSize: this.PageSize,
                pageNo: this.PageNo
            }
        }).then((res: any) => {
            if (resCodeCheck(res)) { return }
            const data = res.data
            // 如果 data 是有长度的数组，push 到 messageList 中
            if (data instanceof Array && data.length) {
                // 添加列表时间
                data.forEach(item => {
                    // 内容为图片显示'[图片]'
                    if (/^<img/.test(item.Content)) {
                        item.Content = '[图片]';
                    }
                    // 内容是优惠券
                    else if (/^{.*}$/.test(item.Content)) {
                        item.Content = JSON.parse(item.Content).Name;
                    }
                    else {
                        // 去掉标签
                        item.Content = item.Content.replace(/<[^>]+>/g, "")
                    }
                    item.time = listTimeFormat(item.CustomerActiveTime)
                    return item
                })
                this.data.messageList.push(...data)
            }
            const delay = isRefresh ? refreshDelay : 0
            setTimeout(() => {
                this.setData({
                    loaded: true,
                    messageList: this.data.messageList
                })
                if (isRefresh) {
                    wx.stopPullDownRefresh()
                    toast.showSuccess('刷新成功')
                } else {
                    toast.hide()
                }
            }, delay)
        })
    }
    /**
     * 列表项进入
     * @param {any} e 
     * @memberof MessagePage
     */
    public toDetail(e) {
        const id = e.currentTarget.dataset.id,
            name = e.currentTarget.dataset.name
        wx.navigateTo({
            url: pagePath.chat + '?id=' + id + '&name=' + name
        });
    }


    private onPullDownRefresh() {
        this.addListItem(true)
    }
    private onReachBottom() {
        this.addListItem()
    }



    /**
     * 搜索组件相关
     */
    /**
     * 展开搜索组件
     * @param {any} e 
     * @memberof MessagePage
     */
    public openSearch(e) {
        this.search.openSearch(e);
    }
    /**
     * 关闭搜索组件
     * @private
     * @memberof MessagePage
     */
    public closeSearch(e) {
        this.search.closeSearch(e);
    }
    /**
     * 搜索输入框虚拟键盘 confirm 点击事件
     * 调用 Search 组件 sendSearch 方法
     * @param {any} e 
     * @memberof MessagePage
     */
    public sendSearch(e) {
        this.search.sendSearch(e, keyword => {
            return new Promise((resovle, reject) => {
                toast.showLoading();
                request({
                    url: domain + '/WX/Message/ReadForGroup', data: { PageSize: maxPageSize, PageNo: 1, MultiWord: keyword }
                }).then((res: any) => {
                    if (resCodeCheck(res)) { return }
                    if (res.data instanceof Array) {
                        if (res.data.length) {
                            let formatData = res.data.map(item => ({
                                id: item.CustomerId,
                                avatar: item.CustomerImage,
                                name: item.CustomerName,
                                nickname: item.CustomerNickname,
                                time: listTimeFormat(item.CustomerActiveTime),
                                content: (() => {
                                    let content = '';
                                    if (/^<img/.test(item.Content)) { // 内容是图片标签
                                        content = '[图片]';
                                    } else if (/^{.*}$/.test(item.Content)) { // 内容是优惠券 jsonStr
                                        content = JSON.parse(item.Content).Name;
                                    } else { // 去掉标签
                                        content = item.Content.replace(/<[^>]+>/g, "")
                                    }
                                    return content;
                                })()
                            }));
                            toast.hide();
                            resovle(formatData);
                        } else {
                            toast.showWarning('未搜索到相关结果');
                            resovle([]);
                        }
                    } else { reject('服务器返回数据类型有误'); }
                });
            });
        });
    }
}

Page(new MessagePage());


