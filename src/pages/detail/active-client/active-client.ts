/*
 * 活跃客户列表
 * @Author: 云程科技
 * @Date: 2017-08-27 01:58:05 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-27 01:58:37
 */

import BasePage from '../../basepage';

interface Data {
    loaded: boolean;
}

class ActiveClientPage extends BasePage {
    public data: Data = {
        loaded: false,
    }
    private onLoad(options) {
        this.setData({
            loaded: true
        });
    }
}

Page(new ActiveClientPage());