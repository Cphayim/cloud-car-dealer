import BasePage from '../../../basepage';
import { request } from '../../../../modules/request';
import { domain } from '../../../../config/url.config';


interface Data {
    loaded: boolean;
    introData: {
        avatar: string,
        realname: string,
        username: string,
        time?: string,
        phone?: string,
        customerId: number,
    };
    trajectoryList: any[];
}

class ActiveInfoPage extends BasePage {
    private id: number = 0;
    public data: Data = {
        loaded: false,
        introData: {
            customerId: 0,
            avatar: '',
            realname: '',
            username: '',
            time: '',
            phone: ''
        },
        trajectoryList: []
    }
    private onLoad(options) {
        const id = ~~options.id;
        this.id = id;
        this.loadData
    }
    private loadData() {
        this.requestData()
            .then((res: any) => {

            });

    }
    private requestData() {
        const data = {
            ticket: wx.getStorageSync('ticket'),
            id: this.id,
            type: 'Pre'
        }
        return request({
            url: domain + '/ApiCustomerPre/DetailForPreActive',
            data: data
        });
    }
}

Page(new ActiveInfoPage());