/*
 * 顾问二维码页面
 * @Author: 云程科技
 * @Date: 2017-08-24 19:28:13 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-24 20:25:54
 */

import BasePage from '../../basepage';

interface Data {
    loaded: boolean,
}

class QRCodePage extends BasePage {
    public data: Data = {
        loaded: false,
    }
    private onLoad(options) {
        this.setData({
            loaded: true
        })
    }
}

Page(new QRCodePage());