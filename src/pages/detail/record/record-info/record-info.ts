/*
 * 待建档客户 线索详情
 * @Author: Cphayim 
 * @Date: 2017-08-27 02:40:05 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-27 15:39:25
 */

import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';

interface Data {
    loaded: boolean;
    introData: {
        avatar: string,
        realname: string,
        username: string,
        time?: string,
        phone?: string,
        customerId: number,
    }
}

class RecordInfoPage extends BasePage {
    private id: number = 0;
    public data: Data = {
        loaded: false,
        introData: {
            customerId: 100,
            avatar: 'https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg',
            realname: 'Cphayim',
            username: 'Cphayim',
        }
    }
    private onLoad(options) {
        const id: number = ~~options.id;
        this.id = id;
        this.setData({
            loaded: true
        });
    }
    private goToRecord() {
        wx.navigateTo({
            url: `${pagePath['record-edit']}?id=${this.id}`
        });
    }
}

Page(new RecordInfoPage());