/*
 * Selection 组件类
 * 用于实例化一个 selection 对象
 * @Author: Cphayim 
 * @Date: 2017-07-06 17:53:55 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 10:00:50
 */

/**
 * 下拉列表和筛选列表组件类
 * @class Selection
 */
class Selection {
    /**
     * 配置
     */
    private isExistScreening: boolean; // 是否存在筛选组
    private isShowMask: boolean; // Mask 是否为隐藏状态
    /**
     * 数据
     */
    private selectionData: any;
    /*
     * Select 与 option 相关参数
     */
    private isShowSelectBox: boolean;  // 选项盒子是否显示
    private selectActiveIndex: number; // 当前展开的 select 索引，—1 为没有展开项
    private selectAnimationIndex: number; // 列表动画(延迟)
    /*
     * Screening 相关参数
     */
    private isShowScreeningBox: boolean; // 筛选盒子是否显示
    private screeningActiveListIndex: number; // 筛选盒子中当前 active 的列表索引
    private query: any; // 查询对象(用于返回给外部当前组件选择状态)
    /**
     * Selection 构造器
     * @param {Object} 
     * 解构赋值参数
     * {
     *    // isExistScreening Boolean 是否存在筛选组
     *    // selection 数据数组 默认值空数组
     *    selectionData = [
     *      {
     *          // 查询参数名，用于请求
     *          name: 'name1',
     *          // 选项列表头，用于视图层渲染显示
     *          title: '排序',
     *          // 类型，可选值 all/select/screening，模板根据该值确定在对应的位置渲染
     *          type: 'all', 
     *          // 选项数组
     *          opts:[{
     *              // 选项标题，用于视图层渲染显示
     *              title: '从大到小',
     *              val: '100'
     *          }]
     *      }
     *    ], 
     * } 
     */


    constructor(
        { isExistScreening = true, selectionData = [], }: { isExistScreening?: boolean, selectionData: any[] }) {
        // 是否存在筛选组
        this.isExistScreening = isExistScreening;
        // Mask 是否为隐藏状态
        this.isShowMask = false;
        // 数据 
        this.selectionData = selectionData;

        // 选项盒子是否显示
        this.isShowSelectBox = false;
        // 当前展开的 select 索引，—1 为没有展开项
        this.selectActiveIndex = -1;
        // 列表动画(延迟)
        this.selectAnimationIndex = -1;

        // 筛选盒子是否显示
        this.isShowScreeningBox = false;
        // 筛选盒子中当前 active 的列表索引
        this.screeningActiveListIndex = -1;
    }
    // 方法
    /**
     * 
     * 展开下拉选项卡
     * 触发条件：Select tap 事件
     * @param {Object} e eventObject 
     * @memberof Selection
     */
    public showSelect(e): void {
        // 获取事件目标携带的索引值
        const index = e.currentTarget.dataset.index;

        // 没有取到 index 不进行后续操作
        if (index == undefined) return console.log('没有取到事件目标的 index');

        // 如果索引值等于当前的 activeIndex 调用 hideSelect 隐藏下拉选项
        if (this.selectActiveIndex === index) {
            this.hideSelect(null);
        }
        // 否则展开当前 index 对应的下拉选项卡
        else {
            // 设置容器状态，打开遮罩层
            this.isShowSelectBox = true;
            this.selectActiveIndex = index;
            this.isShowMask = true;
            this.syncSelectionToView();
            // 延迟调用入场动画 delay:50ms
            setTimeout(() => {
                this.selectAnimationIndex = index;
                this.syncSelectionToView();
            }, 50)
        }
    }
    /**
     * 隐藏下拉选项
     * 调用：Mask tap 事件或 option-list 完成 btn tap 事件
     * @private
     * @param {any} e eventObject
     * @param {boolean} [isFromScreening=false] 是否来自筛选盒子的调用
     * @memberof Selection
     */
    private hideSelect(isFromScreening = false): void {
        // 设置容器状态
        this.isShowSelectBox = false;
        this.selectActiveIndex = -1;
        this.selectAnimationIndex = -1;
        // 如果不是来自筛选盒子触发，关闭遮罩层，更新视图层
        if (!isFromScreening) {
            this.isShowMask = false;
            this.syncSelectionToView();
        }
    }
    /**
     * 用于更新已选项（Select下拉选项）
     * 触发条件： Option-list 上的委托事件，接收来自 option 的 tap 事件冒泡
     * @param {any} e eventObject 
     * @memberof Selection
     */
    public chooseOption(e): any {
        // 获取冒泡触发事件的 option-list 对应的 selectionIndex(用于取val) 和 selectionName(用于query查找对应对象)
        let selectionIndex = e.currentTarget.dataset.selectionIndex;
        let selectionName = e.currentTarget.dataset.selectionName;
        // 获取目标 option 的 optionIndex
        let optionIndex = e.target.dataset.optionIndex;

        // 没有取到 index 数据不进行后续处理
        if (selectionIndex == undefined || optionIndex == undefined) return console.log('没有取到事件目标的 index');

        // 判断是否是已选择的选项，如果是则不进行视图层更新(减少渲染负载优化性能)
        if (this.query[selectionName].idx === optionIndex) return false;

        // 修改 query 中索引和值
        this.query[selectionName].idx = optionIndex;
        this.query[selectionName].val = this.selectionData[selectionIndex].opts[optionIndex].val;
        this.syncSelectionToView();
        console.log('切换下拉选项成功，当前 query 对象：');
        console.log(this.query);
        setTimeout(() => {
            this.hideSelect();
        }, 500);
        return this.query;
    }
    /**
     * 显示筛选盒子
     * 触发条件：Select 中 Screening Tap 事件
     * @param {Object} e eventObject
     */
    public showScreening(e): void {
        // 如果 select box 显示，先关闭 select box
        this.isShowSelectBox && this.hideSelect(true);
        // 设置容器状态，打开遮罩层
        this.isShowScreeningBox = true;
        this.isShowMask = true;
        this.syncSelectionToView();
    }
    /**
     * 完成筛选，隐藏筛选盒子
     * 触发条件：screening-list-group 中完成按钮 tap 事件
     * @param {Object} e eventObject
     */
    public finishScreening(e): void {
        if (!this.isShowScreeningBox) return;
        this.isShowScreeningBox = false;
        this.isShowMask = false;
        this.syncSelectionToView();
    }
    /**
     * 切换筛选列表
     * 触发条件：筛选列表头 tap 事件
     * @param {Object} e eventObject
     */
    public switchScreening(e): void {
        // 获取事件目标携带的索引值
        const index = e.currentTarget.dataset.index;
        // 没取到值不进行操作
        if (index == undefined) return console.log('没有取到事件目标的 index');
        // 和当前 active 的索引相同不进行操作
        if (this.screeningActiveListIndex === index) return;
        // 更新 activeListIndex
        this.screeningActiveListIndex = index;
        this.syncSelectionToView();
    }
    /**
     * 更新 筛选列表的已选项
     * 触发条件：筛选列表上的委托事件，接收来自 筛选列表项 的 tap 事件冒泡
     * @param {Object} e eventObject
     */
    public chooseScreeningOption(e): any {
        // 获取冒泡触发事件的 screening-option-list 对应的 selectionIndex(用于取val) 和 selectionName(用于query查找对应对象)
        let selectionIndex = e.currentTarget.dataset.selectionIndex;
        let selectionName = e.currentTarget.dataset.selectionName;
        // 获取目标 option 的 optionIndex
        let optionIndex = e.target.dataset.optionIndex;

        // 没有取到 index 数据不进行后续处理
        if (selectionIndex == undefined || optionIndex == undefined) return console.log('没有取到事件目标的 index');

        // 判断是否是已选择的选项，如果是则不进行视图层更新(减少渲染负载优化性能)
        if (this.query[selectionName].idx === optionIndex) return this.query;

        // 修改 query 中索引和值
        this.query[selectionName].idx = optionIndex;
        this.query[selectionName].val = this.selectionData[selectionIndex].opts[optionIndex].val;
        this.syncSelectionToView();
        console.log('切换筛选选项成功，当前 query 对象：');
        console.log(this.query);
        return this.query;
    }
    /**
     * Mask tap 事件
     * 判断是否调用 hideSelect 方法
     * @param {Object} e eventObject
     */
    public closeMask(e) {
        // 筛选盒子禁止通过 mask 关闭
        if (this.isShowScreeningBox) return;
        if (this.isShowSelectBox) {
            this.hideSelect();
        }
    }
    /**
     * selection 组件通用方法，用于将数据同步到视图层
     * 更新 this 到视图层
     */
    private syncSelectionToView() {
        const currentPages = getCurrentPages();
        currentPages[currentPages.length - 1].setData({
            selection: this
        });
    }
    /**
     * 重置 query
     */
    public resetQuery() {
        this.query = {};
        this.selectionData.forEach((item, index, arr) => {
            this.query[`${item.name}`] = {
                val: item.opts[0].val,
                idx: 0
            }
        });
        this.syncSelectionToView();
        return this.query;
    }
    /**
     * 初始化
     */
    public init() {
        // 设置 screeningActiveListIndex 的初值为selectData 数组中
        // 第一个 type 为 screening 或 all 的 对象
        for (let i = 0, length = this.selectionData.length; i < length; i++) {
            // console.log(this.selectionData[i]);
            if (this.selectionData[i].type === 'screening' || this.selectionData[i].type === 'all') {
                this.screeningActiveListIndex = i;
                break;
            }
        }
        // 重置一次 query 对象
        this.resetQuery();
        this.syncSelectionToView();
    }
    /**
     * 更新 selectionData 并重启组件
     * @param selectionData 
     */
    public update(selectionData) {
        if (!selectionData || !(selectionData instanceof Array)){
            return;
        }
        if(!selectionData.length){
            return;
        }
        this.selectionData = selectionData;
        this.init();
    }
}

export default Selection