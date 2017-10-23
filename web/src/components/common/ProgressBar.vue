<style lang="scss" scoped>
.u-progress-bar {
  overflow: hidden;
  height: 1rem;
  border-radius: 300px;
  background-color: #eaeaea;
  span {
    display: block; // width: 100%;
    height: 100%;
    transition: all 0.3s;
    transform-origin: left center;
    background-color: #66cc99;
    transform: scaleX(0);
  }
}
</style>

<template>
  <div class="u-progress-bar" :style="{width:width,height:height,backgroundColor:backColor}">
    <span :style="{transform:`scaleX(${percentage})`,backgroundColor:color}"></span>
  </div>
</template>

<script>
/*
 * { 通用类 }
 * 进度条组件
 *
 * prop 参数:
 * percentage {number, string}  进度条进度       默认值 0
 * width      {string}          整体宽度        默认值 '100%'
 * height     {string}          整体高度        默认值 '1rem'
 * color      {string}          进度条颜色       默认值 '#66cc99' 绿
 * backColor  {string}          进度条背景色     默认值 '#eaeaea' 灰
 * 
 * @Author: Cphayim 
 * @Date: 2017-10-18 12:42:26 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-19 16:37:28
 */
export default {
  name: 'Progress',
  props: {
    percentage: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: '#66cc99'
    },
    backColor: {
      type: String,
      default: '#eaeaea'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '1rem'
    }
  },
  data() {
    return {}
  }
}
</script>
