/** 
 * TabSlider 通用组件类
 * @Author: Cphayim
 * @Date: 2017-07-13 17:02:18 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-19 15:00:57
 */

import toast from '../../modules/toast'

/**
 * 带 Tab 头的滑动列表组件类
 * 用以创建一个带 Tab 标题栏的 可左右滑动切换列表
 * @class Slider
 */
class TabSlider {
    private swiperHeight: number;
    private heightRatio: number;
    public sliderActiveIndex: number;
    private sliderTabCount: number;
    private sliderData: any[];
    /**
     *
     * @param {object} {
     *         sliderData = [],
     *         heightRatio = 1, // 整个组件占屏幕视口高度的百分比，默认满屏
     *     } 
     * sliderData 结构说明
     * [// 外层数组中的每个对象表示一个 tab 头与对应的列表
     *  { // 文字
     *      tabTitle: '',
     *      listType: 'text',
     *      items: [
     *      //  内层数组中的每个对象表示列表中的一行
     *      {
     *          id: 101,
     *          title: '', // 标题
     *          content: '', // 内容
     *          label: '', // 显示在 content 下的小文字，可显示时间或位置
     *      }]
     *  }, { // 图文
     *      tabTitle: '',
     *      listType: 'graphic',
     *      items: [{
     *          id: 333
     *          image: '', // 图片地址
     *          title: '', // 标题
     *          content: '', // 内容
     *          starttime: '', // 开始时间
     *          endtime: '' // 结束时间
     *      }]
     *  }, { // 票券
     *      tabTitle: '',
     *      listType: 'ticket',
     *      items: [{
     *          id: 555,
     *          title: '', // 标题
     *          type: '', // 如: 普通券, VIP券
     *          time: '' // 时间 x ~ y
     *      }]
     *  },{ // 时间轴
     *      tabTitle: '',
     *      listType: 'axis',
     *      items:[
     *          {
     *              time: '', // 时间
     *              content: '' // 内容
     *          }
     *      ]
     *  }]
     * 
     * @memberof TabSlider
     */
    constructor({
        sliderData = [],
        heightRatio = 1, // 整个组件占屏幕视口高度的百分比，默认满屏
    }) {
        // 组件渲染数据
        this.sliderData = sliderData;
        // tab 数量，影响 tab 滑动条的宽度
        this.sliderTabCount = sliderData.length;

        // Tab 头(.slider-head)相关属性
        // 当前 active 的索引值，映射到列表
        this.sliderActiveIndex = 0;
        // 列表(.slider-body)相关属性
        /**
         * 滑动列表组件高度
         * 需要在 onload 生命周期调用 updateSwiperHeight 方法更新该值
         */
        this.heightRatio = heightRatio;
        this.swiperHeight = 0;
    }
    /**
     * Tip:
     * 由于小程序的限制
     * 以下类方法不能直接挂到 Page(options) 中
     * 需要你在 Page(options)的 options 中 定义一个同名方法并在其中调用它
     * 后续可补充你的业务逻辑
     * 例如:
     * const _slider = new Slider();
     * page({
     *     data:{},
     *     changeSlider(e){
     *          _slider.changeSlider(e);
     *          // 这里写你的业务逻辑代码
     *     }
     * })
     */
    /**
     * ! 这个方法请在 page 中 定义一个同名方法，并在其中调用这个方法
     * 改变 Slider 状态
     * slider-body 滑动事件 或 slider-head tap 事件
     * @param {object} e 
     */
    changeSlider(e) {
        // 当第一个值为 0 会导致 || 取到第二个值 undefined，故在结尾添加 0
        this.sliderActiveIndex = e.target.dataset.index || e.detail.current || 0;
        this.syncSliderToView();
    }
    /**
     * 设置 Swiper 组件高度
     * init 方法 中调用
     */
    setSwiperHeight() {
        // 数据小于等于一组将不显示 tab 栏
        if (this.sliderData.length <= 1) {
            // 滑动列表高度 = 系统可用高度
            this.swiperHeight = wx.getSystemInfoSync().windowHeight * this.heightRatio;
            this.syncSliderToView();
        } else {
            // 滑动列表高度 = 系统可用高度 - tab 栏高度
            wx.createSelectorQuery().select('.cy-tab-slider .slider-head')
                .boundingClientRect(res => {
                    this.swiperHeight = wx.getSystemInfoSync().windowHeight * this.heightRatio - res.height;
                    this.syncSliderToView();
                }).exec();
        }
    }
    /**
     * 设置 tab 上的滑动条宽度
     */
    setSliderBorder() {
        this.sliderTabCount = this.sliderData.length;
        this.syncSliderToView();
    }
    /**
     * 同步数据到视图层，内部方法，不要在外部调用
     */
    syncSliderToView() {
        const currentPages = getCurrentPages();
        currentPages[currentPages.length - 1].setData({
            tabSlider: this
        });
    }
    /**
     * 组件初始化，请在页面 onload 中调用该方法初始化组件
     */
    init() {
        setTimeout(() => {
            this.setSwiperHeight();
            // this.sliderActiveIndex = 0; // 重置索引
        }, 300);
    }
    /**
     * 更新 sliderData 中的数据
     */
    update(sliderData) {
        // 类型判断，是否是数组
        if (sliderData instanceof Array) {
            this.sliderData = sliderData;
            this.setSliderBorder();
            this.init();
        } else {
            toast.showError('无效的参数');
        }
    }
}

export default TabSlider