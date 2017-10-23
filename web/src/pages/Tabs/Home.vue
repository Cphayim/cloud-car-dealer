<style lang="scss" scoped>
@import "../../styles/style-config.scss";
.section {
  // 页面块
  background-color: #fff;
  margin-bottom: r(10);
  &.pad {
    // 填充层，如果需要 上下6px 左右15px 的填充层，添加此样式
    padding: r(10) r(15);
  }
}

.m-report {
  .report-row {
    display: flex;
    border-bottom: 1px solid $color_b;
    &:last-child {
      border: none;
    }
  }
  .report-item {
    flex: 1;
    display: flex;
    padding: r(10) r(15);
    @include image("../../assets/icons/home-point.png", auto 16px, 100% center);
    &:last-child {
      background: none;
    }
    .basic {
      flex: 2;
      .cate {
        @include font($font_small, $color_f2);
      }
      .total {
        @include font($font_big, $color_f1);
      }
    }
    .more {
      flex: 3;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      @include font($font_nano, $color_f2);
      >div {
        // display: inline-block;
        padding-left: r(2);
        >span {
          @include font($font_nano, $color_em);
        }
      }
    }
  }
}

.m-letter {
  display: flex;
  .l {
    flex: 0 0 auto;
    border-right: 1px solid $color_b;
    padding-right: r(15);
  }

  .r {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: r(15);
  }
  .icon {
    width: r(100);
    height: r(40);
    @include image("../../assets/icons/home-marketing.png");
  }
  .last {
    width: r(200);
    @include text-clip-single();
    @include font($font_small, $color_f2);
  }
}

.m-card-group {
  display: flex;
  justify-content: space-between;
  text-align: center;
  line-height: 1.5;
  .card {
    box-sizing: border-box;
    width: 32%;
    padding: r(15) 0;
    @include image("../../assets/icons/home-card.png");
  }
  .title {
    @include font($font_small, $color_f1);
  }
  .new {
    @include font($font_big, $color_em);
  }
  .count {
    @include font($font_nano, $color_f2);
  }
}

.m-target {
  display: flex;
  .item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .desc {
      padding-left: r(5);
      >span {
        display: block;
      }
      .name {
        @include font($font_nano, $color_f1);
      }
      .data {
        @include font($font_nano, $color_f3);
      }
    }
  }
}
</style>

<template>
  <div class="p-home">
    <!-- 导航栏 -->
    <mt-header fixed :title="pageTitle"></mt-header>
    <!-- /导航栏 -->

    <!-- 战报 -->
    <div class="m-report section">
      <!-- 战报子项 -->
      <!-- 管理员显示: 粉丝、潜客、老客 -->
      <!-- 销售显示: 粉丝、潜客 -->
      <!-- 售后显示: 粉丝、老客 -->
      <!-- 第一行 -->
      <div class="report-row">
        <div class="report-item">
          <div class="basic">
            <div class="cate">粉丝</div>
            <div class="total">{{report.customer}}</div>
          </div>
          <div class="more">
            <div>新增
              <span>{{report.customerIncreased}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- /第一行 -->
      <!-- 第二行 -->
      <div class="report-row">
        <div v-if="role === 'Scales' || role === 'Admin'" class="report-item">
          <div class="basic">
            <div class="cate">潜客</div>
            <div class="total">{{report.customerPre}}</div>
          </div>
          <div class="more">
            <div>待分配
              <span>{{report.customerPreUnassign}}</span>
            </div>
            <div>新增
              <span>{{report.customerPreIncreased}}</span>
            </div>
          </div>
        </div>
        <div v-if="role === 'Service' || role === 'Admin'" class="report-item">
          <div class="basic">
            <div class="cate">老客</div>
            <div class="total">{{report.customerAfter}}</div>
          </div>
          <div class="more">
            <div>待分配
              <span>{{report.customerAfterUnassign}}</span>
            </div>
            <div>待验证
              <span>{{report.customerAfterUndeal}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- /第二行 -->
    </div>
    <!-- /战报 -->

    <!-- 站内信 -->
    <div class="m-letter section pad">
      <div class="l">
        <div class="icon"></div>
      </div>
      <div class="r">
        <p class="last">[黄晓米] 请您审核下优惠期活动的是打算大所大所多阿萨德多</p>
      </div>
    </div>
    <!-- /站内信 -->

    <!-- 卡片组 -->
    <div class="m-card-group section pad">
      <div class="card">
        <p class="title">在线报名</p>
        <p class="new">{{cards.onlineRegistUndeal}}</p>
        <p class="count">累计总数 {{cards.onlineRegist}}</p>
      </div>
      <div class="card">
        <p class="title">微信对话</p>
        <p class="new">{{cards.messageUnreply}}</p>
        <p class="count">累计总数 {{cards.message}}</p>
      </div>
      <div class="card">
        <p class="title">活跃客户</p>
        <p class="new">{{cards.activeCustomerUndeal}}</p>
        <p class="count">累计总数 {{cards.activeCustomerUndeal}}</p>
      </div>
    </div>
    <!-- /卡片组 -->

    <!-- 任务: 销售 -->
    <task-list classify="sale" :task="task" class="section"></task-list>
    <!-- /任务: 销售 -->

    <!-- 任务: 售后 -->
    <task-list classify="service" :task="task" class="section"></task-list>
    <!-- /任务: 售后 -->

    <!-- 目标 -->
    <div class="m-target section pad">
      <div class="item">
        <progress-circle :percentage="target.deliverCurrent/target.deliverTarget" :radius="progressCircelConfig.radius" :color="progressCircelConfig.color1"></progress-circle>
        <div class="desc">
          <span class="name">交车目标</span>
          <span class="data">{{target.deliverCurrent}}/{{target.deliverTarget}}</span>
        </div>
      </div>
      <div class="item">
        <progress-circle :percentage="target.followCurrent/target.followTarget" :radius="progressCircelConfig.radius" :color="progressCircelConfig.color2"></progress-circle>
        <div class="desc">
          <span class="name">增粉目标</span>
          <span class="data">{{target.followCurrent}}/{{target.followTarget}}</span>
        </div>
      </div>
      <div class="item">
        <progress-circle :percentage="target.satisfied" :radius="progressCircelConfig.radius" :color="progressCircelConfig.color3"></progress-circle>
        <div class="desc">
          <span class="name">满意度</span>
          <span class="data">{{(target.satisfied*100).toFixed(2)}}%</span>
        </div>
      </div>
    </div>
    <!-- 目标 -->

  </div>
</template>

<script>
import TaskList from '@/components/business/TaskList'
import ProgressCircle from '@/components/common/progressCircle'
import CONFIG from '../../config/config'

export default {
  name: 'HomePage',
  components: { TaskList, ProgressCircle },
  data() {
    return {
      role: '',
      pageTitle: '', // 这里之后根据登录角色来更变
      progressCircelConfig: {
        radius: 20,
        color1: '#f35833',
        color2: '#9ee089',
        color3: '#54b4ef'
      },
      report: {
        customer: 0, // 粉丝
        customerIncreased: 0, // 粉丝新增
        customerPre: 0, // 潜客
        customerPreUnassign: 0, // 潜客待分配
        customerPreIncreased: 0, // 潜客新增
        customerAfter: 0, // 老客
        customerAfterUnassign: 0, // 老客待分配
        customerAfterUndeal: 0 // 老客待验证
      },
      cards: {
        onlineRegist: 0, // 在线报名累计
        onlineRegistUndeal: 0, // 在线报名新增
        message: 0, // 微信对话累计
        messageUnreply: 0, // 微信对话未读
        activeCustomer: 0, // 活跃客户累计
        activeCustomerUndeal: 0 // 活跃客户新增
      },
      task: {
        /* 销售 */
        visit: 0, // 回访数
        visitTotal: 0, // 回访总数
        deliver: 0, // 交车数
        deliverTotal: 0, // 交车总数
        /* 售后 */
        birthday: 0, // 生日
        maintain: 0, // 保养
        reinsurance: 0, // 保险
        inspection: 0 // 年检
      },
      target: {
        deliverCurrent: 0, // 交车当前
        deliverTarget: 0, // 交车目标
        followCurrent: 0, // 增粉当前
        followTarget: 0, // 增粉目标
        satisfied: 0 // 满意度
      }
    }
  },
  methods: {
    loadAdmin() {
      this.$axios({
        url: CONFIG.HOST + '/Statistic/GetTenantTotal?&isNew=false&r=' + Math.random(),
        method: 'get'
      }).then(res => {
        let { data } = res
        this.report = {
          customer: data.Customer || 0,
          customerIncreased: data.CustomerIncreased || 0,
          customerPre: data.CustomerPre || 0,
          customerPreUnassign: data.CustomerPreUnassign || 0,
          customerPreIncreased: data.CustomerPreIncreased || 0,
          customerAfter: data.CustomerAfter || 0,
          customerAfterUnassign: data.CustomerAfterUnassign || 0,
          customerAfterUndeal: data.CustomerAfterUndeal || 0
        }
        this.cards = {
          onlineRegist: (data.BusinessPre + data.BusinessAfter + data.Maintain + data.Reinsurance + data.SOSMessageTotal) || 0,
          onlineRegistUndeal: (data.BusinessPreUndeal + data.BusinessAfterUndeal + data.MaintainUndeal + data.ReinsuranceUndeal + data.SOSMessageUndeal) || 0,
          message: data.Message || 0,
          messageUnreply: data.MessageUnReply || 0,
          activeCustomer: data.ActiveCustomer + data.ActiveCustomerUndeal || 0,
          activeCustomerUndeal: data.ActiveCustomerUndeal || 0
        }
        this.task = {
          visit: data.VisitTotal || 0,
          visitTotal: data.NoVisitTotal || 0,
          deliver: data.DeliverCarCount || 0,
          deliverTotal: data.DeliverAllCount || 0,
          birthday: data.BirthdayCount || 0,
          maintain: data.NeedMaintain || 0,
          reinsurance: data.NeedReinsurance || 0,
          inspection: data.NeedInspection || 0
        }
        this.target = {
          deliverCurrent: data.SignGoal || 0,
          deliverTarget: data.SaleGoal || 0,
          followCurrent: data.FollowTargetGoalSignGoal || 0,
          followTarget: data.FollowTargetGoal || 0,
          satisfied: (() => {
            let satisfied = 0
            if (data.EvaluationSumScore > 0 && data.EvaluationTotal > 0) {
              // 满意度 = 实际分数 / 总分
              let temp = data.EvaluationSumScore / data.EvaluationTotal
              if (temp < 0) {
                satisfied = 0
              } else if (temp > 1) {
                satisfied = 1
              } else {
                satisfied = temp
              }
            }
            return satisfied
          })()
        }
      })
    },
    loadSales() { },
    loadService() { }
  },
  created() {
    if (typeof GLOBAL_ROLE !== 'string') return this.$toast('获取角色信息失败!')
    this.role = GLOBAL_ROLE.slice(3)

    console.log(this.role)
    switch (this.role) {
      case 'Sales':
        this.loadScales(); this.pageTitle = '销售顾问'; break
      case 'Service':
        this.loadService(); this.pageTitle = '售后顾问'; break
      case 'Admin':
        this.loadAdmin(); this.pageTitle = '店铺管理员'; break
      default:
        this.$toast('角色信息有误!')
    }
  }
}
</script>
