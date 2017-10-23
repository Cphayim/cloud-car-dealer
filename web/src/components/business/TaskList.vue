<style lang="scss" scoped>
@import '../../styles/style-config.scss';

.m-task-list {
  .item {
    display: flex;
    align-items: center;
    padding: r(10) r(15);
    border-bottom: 1px solid $color_b;
    &:last-child {
      border: none;
    }
    .key {
      // 背景图尺寸，正方形
      $bg_icon: 22px;
      flex: 1;
      height: $bg_icon;
      @include font($font_small, $color_f2);
      padding-left: 30px;
      @include image('../../assets/icons/home-task-sale1.png',$bg_icon $bg_icon , 0% center);
    }
    @for $i from 1 through 4 {
      .task-sale#{$i} {
        background-image: url('../../assets/icons/home-task-sale#{$i}.png');
      }
    }
    @for $i from 1 through 4 {
      .task-service#{$i} {
        background-image: url('../../assets/icons/home-task-service#{$i}.png');
      }
    }
    .val {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      @include font($font_small,
      $color_f3);
      span {
        // flex: 1;
        padding-left: r(15);
        text-align: right;
      }
    }
  }
}
</style>

<template>
  <div class="m-task-list">
    <!-- 销售类 -->
    <ul v-if="classify === 'sale'" class="task-sale">
      <li class="item">
        <div class="key task-sale1">回访</div>
        <div class="val">
          <progress-bar :percentage="task.visit/task.visitTotal" :width="progressConfig.width" :height="progressConfig.height" :color="progressConfig.color"></progress-bar>
          <span>{{task.visit}}/{{task.visitTotal}}</span>
        </div>
      </li>
      <!-- 邀约/到店 web版 暂无 -->
      <li v-show="false" class="item">
        <div class="key task-sale2">邀约</div>
        <div class="val">
          <progress-bar :percentage="0.5" :width="progressConfig.width" :height="progressConfig.height" :color="progressConfig.color"></progress-bar>
          <span>15/50</span>
        </div>
      </li>
      <li v-show="false" class="item">
        <div class="key task-sale3">到店</div>
        <div class="val">
          <progress-bar :percentage="0.7" :width="progressConfig.width" :height="progressConfig.height" :color="progressConfig.color"></progress-bar>
          <span>15/50</span>
        </div>
      </li>
      <!-- /邀约/到店 web版 暂无 -->
      <li class="item">
        <div class="key task-sale4">交车</div>
        <div class="val">
          <progress-bar :percentage="task.deliver/task.deliverTotal" :width="progressConfig.width" :height="progressConfig.height" :color="progressConfig.color"></progress-bar>
          <span>{{task.deliver}}/{{task.deliverTotal}}</span>
        </div>
      </li>
    </ul>
    <!-- /销售类 -->

    <!-- 售后类 -->
    <ul v-if="classify === 'service'" class="task-sale">
      <li class="item">
        <div class="key task-service1">生日</div>
        <div class="val">
          <span>{{task.birthday}}</span>
        </div>
      </li>
      <li class="item">
        <div class="key task-service2">保养</div>
        <div class="val">
          <span>{{task.maintain}}</span>
        </div>
      </li>
      <li class="item">
        <div class="key task-service3">保险</div>
        <div class="val">
          <span>{{task.reinsurance}}</span>
        </div>
      </li>
      <li class="item">
        <div class="key task-service4">年检</div>
        <div class="val">
          <span>{{task.inspection}}</span>
        </div>
      </li>
    </ul>
    <!-- /售后类 -->
  </div>
</template>

<script>
/*
 * { 业务类 }
 * Tab - Home 任务列表组件
 *
 * props 参数:
 * classify   {string}    种类 [sale | service]
 * task       {object}    任务列表数据
 *
 * @Author: Cphayim 
 * @Date: 2017-10-19 16:08:03 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-19 16:38:26
 */
import ProgressBar from '../common/ProgressBar'
export default {
  name: 'TaskList',
  components: { ProgressBar },
  props: {
    classify: {
      type: String
    },
    task:{
      type: Object
    }
  },
  data() {
    return {
      progressConfig: {
        width: '50%',
        height: '0.35rem',
        color: '#54b4ef'
      }
    }
  }
}
</script>
