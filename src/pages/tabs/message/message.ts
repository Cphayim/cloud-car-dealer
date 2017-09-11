/*
 * Tab 消息页逻辑
 * @Author: 云程科技 
 * @Date: 2017-06-30 10:12:54 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-11 00:24:06
 */

// 路径模块
import pagePath from '../../../config/path.config'
// 搜索入口组件
import { openSearch } from '../../../components/search/search'
import BasePage from '../../basepage';
import { request } from '../../../modules/request';
import { domain } from '../../../config/config';
import { resCodeCheck } from '../../../modules/auth';
import toast from '../../../modules/toast';
import { refreshDelay } from '../../../config/config';
import { listTimeFormat } from '../../../modules/util';


export class MessagePage extends BasePage {
    private PageSize: number = 20 // 请求item数量
    private PageNo: number = 0 // 请求页码
    private MultiWord: string = '' // 搜索关键字
    public data = {
        loaded: false,
        listPaddingTop: 0,
        messageList: []
    }
    private onLoad(options) {
        wx.createSelectorQuery().select('.m-search-outer').boundingClientRect(rect => {
            this.setData({
                listPaddingTop: rect.height
            })
        }).exec()
        this.addListItem()
    }
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

    public toDetail(e) {
        const id = e.currentTarget.dataset.id,
            name = e.currentTarget.dataset.name
        wx.navigateTo({
            url: pagePath.chat + '?id=' + id+'&name='+name
        });
    }
    public openSearch() {
        toast.showWarning('搜索模块正在开发')
    }
    private onPullDownRefresh() {
        this.addListItem(true)
    }
    private onReachBottom() {
        this.addListItem()
    }
}

Page(new MessagePage());