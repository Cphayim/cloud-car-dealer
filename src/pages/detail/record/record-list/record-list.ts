/*
 * 待建档客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 02:19:42 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-27 02:22:45
 */

import BasePage from '../../../basepage';
import pagePath from '../../../../config/path.config';

interface Data {
    loaded: boolean;
}
class RecordListPage extends BasePage {
    public data: Data = {
        loaded: false,
    }
    private onLoad(options) {
        this.setData({
            loaded: true
        });
    }
    private itemToEnter(e) {
        const id: string = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `${pagePath['record-info']}?id=${id}`
        });
    }
}

Page(new RecordListPage());