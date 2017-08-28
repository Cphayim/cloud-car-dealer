import BasePage from '../../../basepage';

interface Data {
    loaded: boolean,
}

class RecordEditPage extends BasePage {
    public data: Data = {
        loaded: false,
    }
    private onLoad(options) {
        const id: number = ~~options;
        this.setData({
            loaded: true
        });
    }
}

Page(new RecordEditPage());