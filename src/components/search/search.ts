/* 
 * 搜索组件类
 * @Author: Cphayim
 * @Date: 2017-07-11 11:10:40 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-22 13:47:05
 */
export default class Search {
    private isOpen: boolean = false; // 是否展开搜索组件
    private isFocus: boolean = false; // 是否聚焦输入框
    private listHeight: number = 0; // 搜索列表滚动视图高度
    private cancelLock: boolean = false; // 取消按钮锁

    private keyword: string = ''; // 搜索关键字
    private searchList: any[] = []; // 列表数据

    /**
     * 组件初始化
     * @memberof Search
     */
    public init() {
        wx.createSelectorQuery()
            .select('.m-search')
            .boundingClientRect(res => {
                // 搜索列表滚动视图高度 = 窗口可用高度 - 搜索组件头部高度
                this.listHeight = wx.getSystemInfoSync().windowHeight - res.height;
                this.syncDataToView();
            }).exec();
    }
    /**
     * 展开搜索组件
     * @param {any} e 
     * @memberof Search
     */
    public openSearch(e?: any) {
        // 展开搜索栏
        this.isOpen = true;
        this.syncDataToView();
        // 延迟聚焦
        setTimeout(() => {
            this.isFocus = true;
            this.syncDataToView();
        }, 100);
    }
    /**
     * 关闭搜索组件
     * @param {any} e 
     * @memberof Search
     */
    public closeSearch(e?: any) {
        // 关闭搜索栏、失焦
        this.isOpen = this.isFocus = false;
        // 移除数据
        this.searchList = [];
        this.keyword = '';
        this.syncDataToView();
    }
    /**
     * 发起搜索(外部调用)
     * @description
     * 该方法需在 page 创建的同名事件函数中调用
     * 返回组件内的 keyword 属性
     * (可选) 可传入一个回调函数，方法回调该函数时将传入 keyword 属性
     * 该回调函数需要返回一个 Promise 对象，resolve 携带值为 经过 format 为 Search 组件模板所支持的对象数组
     * 回调完毕后组件将根据返回结果更新视图层
     * @param {eventObject} e 事件对象
     * @param {callback} [callback=() => { }] 可选, 回调函数
     * @memberof Search
     */
    public sendSearch(e: any, callback = (k) => { return new Promise(resolve => resolve([])) }): string {
        if (!e) {
            throw Error('Search component: sendSearch method require an event source object from the view layer.')
        }
        // 获取搜索关键字
        let { value } = e.detail;
        this.keyword = /^\s*$/.test(value) ? '' : value.replace(/^\s*|\s*$/g, '');
        // 如果当前 keyword 为空，返回空字符串
        if (!this.keyword) {
            this.syncDataToView();
            return ''
        }
        // 若 callback 是函数类型，执行回调
        if (typeof callback === 'function') {
            let res = callback(this.keyword);
            // res 是 Promise 实例，执行数据渲染逻辑
            res.constructor === Promise && res.then(data => {
                if (data instanceof Array) {
                    this.searchList = data;
                } else {
                    console.warn('Search component: \n', data, '\n It is not a valid data format in the template.')
                }
                this.isFocus = false;
                this.syncDataToView();
            }).catch(err => console.warn(err));
        }
        // 返回当前组件中的 关键字
        return this.keyword
    }
    /**
     * 同步组件数据到视图层
     * @private
     * @memberof Search
     */
    private syncDataToView(): void {
        let pages = getCurrentPages();
        pages[pages.length - 1].setData({ search: this });
    }
}
