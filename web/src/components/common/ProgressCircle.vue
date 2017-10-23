<style lang="scss" scoped>
.u-progress-circle {
  display: inline-block;
  font-size: 0; // 底部不留白
  .bar {
    transform: rotate(-90deg);
    transform-origin: center;
  }
}
</style>

<template>
  <div class="u-progress-circle">
    <svg xmlns="http://www.w3.org/200/svg" :width="radius*2+stroke*2" :height="radius*2+stroke*2">
      <circle :cx="radius+stroke" :cy="radius+stroke" :r="radius" fill="none" :stroke="backColor" :stroke-width="stroke" stroke-linecap="round" />
      <circle class="bar" :cx="radius+stroke" :cy="radius+stroke" :r="radius" fill="none" :stroke="color" :stroke-width="stroke" :stroke-dasharray="`${percentageLength},${perimeter}`" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script>
/*
 * { 通用类 }
 * 环形进度条组件
 * 
 * props 参数:
 * percentage   {number}    0-1 进度条百分比       默认值0
 * radius       {number}    环形进度条半径 px      默认值 50
 * stroke       {number}    环形进度条线宽 px      默认值 5
 *          整个 svg 宽高 = radius*2 + stroke*2   
 * color        {string}    环形进度条颜色         默认值 #66cc99 绿色
 * backColor    {string}    环形进度条底色         默认值 #eaeaea 灰色
 *
 * @Author: Cphayim 
 * @Date: 2017-10-18 14:02:56 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-19 16:36:09
 */
export default {
  name: 'ProgressCircle',
  props: { // 百分比
    percentage:{
      type: Number,
      default: 0
    },
    radius: { // 半径
      type: Number,
      default: 50
    },
    stroke: { // 线宽
      type: Number,
      default: 5
    },
    color: { // 颜色
      type: String,
      default: '#66cc99'
    },
    backColor:{ // 底色
      type: String,
      default: '#eaeaea'
    }
  },
  data() {
    return {}
  },
  computed: {
    // 圆周长 2πr
    perimeter() {
      return 2 * Math.PI * this.radius
    },
    // 实际长度 百分比*圆周长
    percentageLength(){
      return this.perimeter * this.percentage
    }
  }
}
</script>