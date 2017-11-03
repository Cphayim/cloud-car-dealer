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

// 进场动画控制 初始化状态
.animation-box {
  .section {
    // 权值 10+10 = 20
    opacity: 0;
    transition: all 0.6s;
  }
  .m-card-group {
    .card {
      transform: scale(0);
    }
  }
  .section:nth-child(2n-1) {
    // 权值 10+10+10 = 30
    transform: translateX(-70%);
  }
  .section:nth-child(2n) {
    transform: translateX(70%);
  }
}

.animation-box.loaded {
  .section {
    // 权值 20+10 = 30
    opacity: 1;
    transform: translateX(0);
  }
  .m-card-group {
    .card {
      transform: scale(1);
    }
    .card:nth-of-type(3) {
      transition: all 0.6s 0.4s;
    }
    .card:nth-of-type(2) {
      transition: all 0.6s 0.6s;
    }
    .card:nth-of-type(1) {
      transition: all 0.6s 0.8s;
    }
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

.m-tools {
  display: flex;
  padding: r(10) 0;
  @for $i from 1 through 5 {
    .icon-#{$i} {
      $url: '../../assets/icons/home-tools-#{$i}.png';
      @include image($url);
    }
  }
  .icon-hope {
    $url: '../../assets/icons/home-tools-hope.png';
    @include image($url);
  }
  .item {
    flex: 0 0 auto;
    width: 25%;
    /* 最多5个按钮 */
    // width: r(69); /* (375-15*2)/5*/
    text-align: center;
    >span {
      display: block;
    }
    .icon {
      position: relative;
      width: r(45);
      height: r(45);
      margin: auto;
      .badge {
        position: absolute;
        top: -5px;
        right: -5px;
        display: inline-block;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        text-align: center;
        background-color: $color_em;
        @include font($font_small, #fff);
      }
    }
    .name {
      margin-top: r(2);
      @include font($font_nano, $color_f2);
    }
  }
}
</style>

<template>
  <mt-loadmore :top-method="loadData" ref="refresh">
    <div class="p-home animation-box" :class="{loaded:isload}">
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
          <!-- 潜客战报: 仅管理员与销售类员工显示 -->
          <div v-if="role === roleEnum['店铺管理员'] || role === roleEnum['销售顾问']" class="report-item">
            <!-- 临时跳转到旧版 -->
            <div @click.stop="tempLinkToOld('/Report/CustomerPreReport/IndexForPreManager?vview=indexforadmin')" class="basic">
              <div class="cate">潜客</div>
              <div class="total">{{report.customerPre}}</div>
            </div>
            <!-- 临时跳转到旧版 -->
            <div class="more">
              <!-- 顾问不显示待分配 -->
              <div @click.stop="tempLinkToOld('/UC/Customer/AssignForPre')" v-show="role !== roleEnum['销售顾问']">待分配
                <span>{{report.customerPreUnassign}}</span>
              </div>
              <div @click.stop="tempLinkToOld('/Report/CustomerPreReport/IndexForPreManager?vview=indexforadmin')">新增
                <span>{{report.customerPreIncreased}}</span>
              </div>
            </div>
          </div>
          <!-- 老客战报: 仅管理员与售后类员工显示 -->
          <div v-if="role === roleEnum['店铺管理员'] || role === roleEnum['售后顾问']" class="report-item">
            <!-- 临时跳转到旧版 -->
            <div @click.stop="tempLinkToOld('/UC/CustomerAfter/IndexForSearch?customerType=After'+(role === roleEnum['售后顾问']?'&EmployeeId='+employeeId:''))" class="basic">
              <div class="cate">老客</div>
              <div class="total">{{report.customerAfter}}</div>
            </div>
            <!-- 临时跳转到旧版 -->
            <div class="more">
              <!-- 顾问不显示待分配 -->
              <div @click.stop="tempLinkToOld('/UC/Customer/AssignForAfter')" v-show="role !== roleEnum['售后顾问']">待分配
                <span>{{report.customerAfterUnassign}}</span>
              </div>
              <div @click.stop="tempLinkToOld('/UC/CustomerAfter/Index?customerType=After&&Status=UnDeal'+(role === roleEnum['售后顾问']?'&EmployeeId='+employeeId:''))">待验证
                <span>{{report.customerAfterUndeal}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- /第二行 -->
      </div>
      <!-- /战报 -->

      <!-- 朋友圈营销 -->
      <div class="m-letter section pad">
        <!-- 临时跳转到旧版 -->
        <div @click.stop="tempLinkToOld('/Pages/Article')" class="l">
          <div class="icon"></div>
        </div>
        <div @click.stop="tempLinkToOld('/Pages/Article')" class="r">
          <p class="last"> {{letter.lastMsg || '暂无'}} </p>
        </div>
      </div>
      <!-- /朋友圈营销 -->

      <!-- 卡片组 -->
      <div class="m-card-group section pad">
        <!-- 临时跳转到旧版 -->
        <div @click.stop="tempLinkToOld('/Pages/Business'+(role === roleEnum['售后顾问']?'&Type=After':''))" class="card">
          <p class="title">在线报名</p>
          <p @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/Pages/Business?status=2':(role === roleEnum['销售顾问']?'/Pages/Business?status=2&type=all':'/Pages/Business?Type=After&Status=2'))" class="new">
            {{cards.onlineRegistUndeal}}
          </p>
          <p class="count">累计总数 {{cards.onlineRegist}}</p>
        </div>
        <!-- 临时跳转到旧版 -->
        <div @click.stop="tempLinkToOld('/Pages/Message')" class="card">
          <p class="title">微信对话</p>
          <p class="new">{{cards.messageUnreply}}</p>
          <p class="count">累计总数 {{cards.message}}</p>
        </div>
        <!-- 临时跳转到旧版 -->
        <div @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/Report/CustomerActiveReport/ActiveChart':(role === roleEnum['销售顾问']?'/UC/Customer/IndexForActive':'/UC/Customer/IndexForActive?Type=After'))" class="card">
          <p class="title">活跃客户</p>
          <p class="new">{{cards.activeCustomerUndeal}}</p>
          <p class="count">累计总数 {{cards.activeCustomer}}</p>
        </div>
      </div>
      <!-- /卡片组 -->

      <!-- 任务: 销售 -->
      <task-list @taskItemTo="tempLinkToOld" v-if="role === roleEnum['销售顾问'] || role === roleEnum['店铺管理员']" classify="sale" :isOpenReVisit="isOpenReVisit" :task="task" :role="role" :roleEnum="roleEnum" class="section"></task-list>
      <!-- /任务: 销售 -->

      <!-- 任务: 售后 -->
      <task-list @taskItemTo="tempLinkToOld" v-if="role === roleEnum['售后顾问'] || role === roleEnum['店铺管理员']" classify="service" :isOpenReVisit="isOpenReVisit" :task="task" :role="role" :roleEnum="roleEnum" class="section"></task-list>
      <!-- /任务: 售后 -->

      <!-- 目标 -->
      <div class="m-target section pad">
        <!-- 交车目标: 仅管理员与销售类员工显示 -->
        <div class="item" v-if="role === roleEnum['销售顾问'] || role === roleEnum['店铺管理员']">
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
        <!-- 临时跳转到旧版 -->
        <div @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/Org/Evaluation/IndexForAdmin':'/Org/Evaluation')" class="item">
          <progress-circle :percentage="target.satisfied" :radius="progressCircelConfig.radius" :color="progressCircelConfig.color3"></progress-circle>
          <div class="desc">
            <span class="name">满意度</span>
            <span class="data">{{(target.satisfied*100).toFixed(2)}}%</span>
          </div>
        </div>
      </div>
      <!-- 目标 -->

      <!-- 工具 -->
      <div class="m-tools section">

        <!-- 临时跳转到旧版 -->
        <!-- 新增客户: 管理员 显示 -->
        <div @click.stop="tempLinkToOld('/UC/Customer/Create?fromT=pre')" v-if="role === roleEnum['店铺管理员']" class="item">
          <span class="icon icon-5"></span>
          <span class="name">新增客户</span>
        </div>
        <!-- 群发消息 -->
        <div @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/UC/Customer/Search':(role === roleEnum['销售顾问']?'/UC/CustomerPre/Search':'/UC/CustomerAfter/Search'))" class="item">
          <span class="icon icon-2"></span>
          <span class="name">群发消息</span>
        </div>
        <!-- 二维码: 顾问 显示 -->
        <div v-if="role !== roleEnum['店铺管理员']" @click.stop="tempLinkToOld('/WX/QRCodeLog/IndexForNewLog')" class="item">
          <span class="icon icon-1"></span>
          <span class="name">二维码</span>
        </div>
        <!-- 扫一扫 -->
        <div @click="openScan" class="item">
          <span class="icon icon-3"></span>
          <span class="name">扫一扫</span>
        </div>
        <!-- 带建档: 销售 显示 -->
        <div @click.stop="tempLinkToOld('/UC/Customer/IndexForRecord')" v-if="role === roleEnum['销售顾问']" class="item">
          <span class="icon icon-4">
            <em v-if="tools.unIncreased > 0" class="badge">{{ tools.unIncreased>99? '...' : tools.unIncreased }}</em>
          </span>
          <span class="name">待建档</span>
        </div>
        <div class="item">
          <span class="icon icon-hope"></span>
          <span class="name">敬请期待</span>
        </div>
      </div>
      <!-- /工具 -->
    </div>
  </mt-loadmore>
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
      isload: false,
      role: '',
      roleEnum: CONFIG.ROLES,
      isOpenReVisit: true, // 是否开启回访
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
      letter: {
        lastMsg: ''
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
      },
      tools: {
        unIncreased: 0 // 待建档数
      }
    }
  },
  methods: {
    loadData() {

      // 记录是否来自下拉刷新触发
      // this.$refs.refresh 可能是 object 或 null
      let isRefresh = !!this.$refs.refresh

      // 如果是下拉刷新重置动画
      // if (isRefresh) {
      this.isload = false
      // }

      this.$indicator.open({
        // 处于下拉刷新状态则显示'刷新'
        text: isRefresh ? '正在刷新...' : '正在加载...',
        spinnerType: 'triple-bounce'
      })

      // 加载角色所属数据
      setTimeout(() => {
        switch (this.role) {
          case this.roleEnum['销售顾问']:
          case this.roleEnum['售后顾问']:
            this.loadCounselor(isRefresh); break
          case this.roleEnum['店铺管理员']:
            this.loadAdmin(isRefresh); break
          default:
            this.$toast('用户角色信息有误!')
            return
        }
      }, isRefresh ? CONFIG.REFRESH_DELAY : 0)

      // 判断是否处于下拉刷新状态，是则收起下拉层
      if (isRefresh) {
        this.$refs.refresh.onTopLoaded()
      }
    },
    /**
     * 管理员数据加载
     */
    loadAdmin(isRefresh = false) {
      this.$axios({
        url: `${CONFIG.HOST}/Statistic/GetTenantTotal?&isNew=${isRefresh ? 'true' : 'false'}&r=${Math.random()}`,
        method: 'get'
      }).then(data => {
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
            let { EvaluationSumScore: score, EvaluationTotal: totalScore } = data
            if (score > 0 && totalScore > 0) {
              // 满意度 = 实际分数 / 总分
              let temp = score / totalScore
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
        setTimeout(_ => {
          this.$indicator.close()
          this.isload = true
        }, 0)
      })
    },
    /**
     * 顾问(销售、售后)数据加载
     */
    loadCounselor(isRefresh = false) {
      this.$axios({
        url: `${CONFIG.HOST}/Report/Statistic/GetEmployeeTotal?&isNew=${isRefresh ? 'true' : 'false'}&r=${Math.random()}`,
        method: 'get'
      }).then(data => {
        this.report = {
          customer: data.Customer || 0,
          customerIncreased: data.CustomerIncreased || 0,
          customerPre: data.MyCustomerPre || 0,
          customerPreUnassign: data.MyCustomerPreUnassign || 0,
          customerPreIncreased: data.MyCustomerPreIncreased || 0,
          customerAfter: data.MyCustomerAfter || 0,
          customerAfterUnassign: data.MyCustomerAfterUnassign || 0,
          customerAfterUndeal: data.MyCustomerAfterUndeal || 0
        }
        this.cards = {
          onlineRegist: (() => {
            if (this.role === this.roleEnum['销售顾问']) {
              return data.MyBusinessPre || 0
            } else {
              return (data.MyBusinessAfter + data.MyMaintain) || 0
            }
          })(),
          onlineRegistUndeal: (() => {
            if (this.role === this.roleEnum['销售顾问']) {
              return data.MyBusinessPreUndeal || 0
            } else {
              return (data.MyBusinessAfterUndeal + data.MyMaintainUndeal) || 0
            }
          })(),
          message: data.MyMessage || 0,
          messageUnreply: data.MyMessageUnreply || 0,
          activeCustomer: (data.MyActiveCustomerUndeal + data.MyActiveCustomer) || 0,
          activeCustomerUndeal: data.MyActiveCustomerUndeal || 0
        }
        this.task = {
          visit: data.MyVisitTotal || 0,
          visitTotal: data.MyNoVisitTotal || 0,
          deliver: data.MyDeliverCarCount || 0,
          deliverTotal: data.MyDeliverAllCount || 0,
          birthday: data.MyBirthdayCount || 0,
          maintain: data.MyNeedMaintain || 0,
          reinsurance: data.MyNeedReinsurance || 0,
          inspection: data.MyNeedInspection || 0
        }
        this.target = {
          deliverCurrent: data.MySignGoal || 0,
          deliverTarget: data.MySaleGoal || 0,
          followCurrent: data.MyFollowTargetGoalSignGoal || 0,
          followTarget: data.MyFollowTargetGoal || 0,
          satisfied: (() => {
            let satisfied = 0
            let { MyEvaluationSumScore: score, MyEvaluationTotal: totalScore } = data
            if (score > 0 && totalScore > 0) {
              // 满意度 = 实际分数 / 总分
              let temp = score / totalScore
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
        this.tools.unIncreased = data.MyCustomerPreUnIncreased || 0
        setTimeout(_ => {
          this.$indicator.close()
          this.isload = true
        }, 0)
      })
    },

    /**
     * 朋友圈营销数据加载
     */
    loadShare() {
      this.$axios({
        url: CONFIG.HOST + '/Car/ShareInfos/ReadForArticle?resultType=json',
        method: 'get'
      }).then(data => {
        if (data && data[0] && data[0].Title) {
          this.letter.lastMsg = data[0].Title
        }
      })
    },

    /**
     * 调用微信端扫码接口
     */
    openScan() {
      let _this = this
      wx.scanQRCode({
        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        needResult: 1,
        // 指定扫二维码还是条形码，或二者都有
        scanType: ['qrCode', 'barCode'],
        success(result) {
          let { resultStr } = result // 当needResult 为 1 时，扫码返回的结果
          _this.$axios({
            url: CONFIG.HOST + '/Biz/QRCodeItem/ScanCode',
            method: 'post',
            data: { no: resultStr }
          }).then(data => {
            console.log(data)
            if (data && data.Errors) {
              return _this.$toast(data.Errors)
            }
            if (!data.url) return
            window.location.href = data.url
          })
        }
      })
    },

    /**
     * 跳转到老版本(临时)
     */
    tempLinkToOld(url) {
      if (!url) return
      location.href = url
    }
  },

  created() {
    // 判断后端是否传递了 全局的 角色信息
    if (typeof GLOBAL !== 'object' || !(typeof GLOBAL.role === 'string')) return this.$toast('角色信息有误')

    this.role = GLOBAL.role
    this.employeeId = GLOBAL.employeeId
    this.isOpenReVisit = GLOBAL.isOpenReVisit

    console.log(this.role)

    // 根据登录的角色修改标题
    this.$emit('changeTitle', this.roleEnum[this.role] || '未知角色')

    // 加载页面数据
    this.loadData()
    // 加载朋友圈营销 lastMsg
    this.loadShare()
  }
}
</script>
