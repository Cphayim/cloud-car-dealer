/*
 * 待建档客户 线索详情
 * @Author: Cphayim 
 * @Date: 2017-08-27 02:40:05 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-29 11:41:52
 */

import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';
import toast from '../../../../modules/toast';
import { resCodeCheck } from '../../../../modules/auth';

interface Data {
    loaded: boolean;
    paddingLayerHeight: number;
    introData: {
        avatar: string,
        realname: string,
        username: string,
        time?: string,
        phone?: string,
        customerId: number,
    },
    clueList: any[]
}

class RecordInfoPage extends BasePage {
    private id: number = 0;
    public data: Data = {
        loaded: false,
        paddingLayerHeight: 0,
        introData: {
            customerId: 100,
            avatar: '',
            realname: '',
            username: '',
        },
        clueList: []
    }
    private onLoad(options) {
        const id: number = ~~options.id;
        this.id = id;

        // 计算填充层
        wx.createSelectorQuery().select('.m-operation').boundingClientRect(rect => {
            this.data.paddingLayerHeight = rect.height;
            this.setData({
                paddingLayerHeight: this.data.paddingLayerHeight
            });
        }).exec();

        this.loadData();
    }
    private loadData() {
        toast.showLoading('正在加载...');
        this.requestData()
            .then((res: any) => {
                if (resCodeCheck(res)) {
                    return;
                }
                const data = res.data;

                // intro 组件数据
                this.data.introData.customerId = data.Id;
                this.data.introData.avatar = data.HeadImgUrl;
                this.data.introData.realname = data.Name;
                this.data.introData.username = data.Nickname;
                this.data.introData.phone = data.MobilePhone;

                // 列表数据
                this.data.clueList = data.clueList;

                this.data.clueList.forEach(item => {

                    const strs = item.ClueContent.split('|');
                    item.clueType = `【${strs[0]}】`;


                    // 如果是图片 把 img 标签过滤掉，只显示链接
                    const reg = /<img.*src=["'](.*)['"].*\/>/;
                    if (reg.test(strs[1])) {
                        strs[1] = strs[1].match(reg)[1];
                    }

                    item.clueTitle = strs[1];
                    return item;
                });

                this.setData({
                    loaded: true,
                    introData: this.data.introData,
                    clueList: this.data.clueList
                });
                toast.hide();
            });
    }
    private requestData() {
        const data = {
            ticket: wx.getStorageSync('ticket'),
            id: this.id
        }
        return request({
            url: `${domain}/ApiCustomerPre/ReadCustomerClue`,
            data: data
        });
    }
    public goToRecord() {
        wx.navigateTo({
            url: `${pagePath['record-edit']}?id=${this.id}`
        });
    }
    /**
     * 拨打手机
     * @param e 
     */
    public callPhone(e) {
        const phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    }
    /**
     * 进入聊天
     * @param e 
     */
    public openChat(e) {
        const id = e.currentTarget.dataset.customerId;
        wx.navigateTo({
            url: `${pagePath.dialogue}?id=${id}`
        });
    }
    /**
     * 列表项进入
     * @param e 
     */
    public itemToEnter(e) {
        const { linkType, customerId, clueId } = e.currentTarget.dataset;

        if (linkType == 1) {
            // 微信对话 -> 对话界面
            wx.navigateTo({
                url: `${pagePath.dialogue}?id=${customerId}`
            });
        } else if (linkType == 2) {
            // 在线报名 -> 报名详情
            wx.navigateTo({
                url: `${pagePath.opportunity}?id=${clueId}`
            });
        } else if (linkType == 3) {
            // 浏览页面 -> 活跃客户轨迹
            wx.navigateTo({
                url: `${pagePath['active-trajectory']}?id=${customerId}`
            });
        } else {
            return;
        }
    }
}

Page(new RecordInfoPage());