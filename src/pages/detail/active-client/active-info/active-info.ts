import BasePage from '../../../basepage';

class ActiveInfoPage extends BasePage {
    private onLoad(options){
        const id = ~~options.id;
    }
}

Page(new ActiveInfoPage());