<style lang="scss" scoped>
@import '../style/base/color.scss';
@import '../style/base/font.scss';
@import '../style/base/mixin.scss';
.g-content {
  padding-top: 40px;
  &.up {
    padding-bottom: 50px;
  }
}

.m-index-tab {
  * {
    box-sizing: border-box;
  }
  i {
    font-style: inherit;
  }
  .item1 {
    width: 100%;
    height: 72px;
    border-bottom: 10px solid #eaeaea;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item1_l {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 3%; // border:1px solid red;
      span {
        flex: auto (1 1 auto);
      }
      span:nth-child(1) {
        font-size: 13px;
        color: #333;
      }
      span:nth-child(2) {
        font-size: 30px;
        color: #666;
      }
    }
    .item1_r {
      width: 70%;
      display: flex;
      flex-direction: row;
      align-items: flex-end; // border:1px solid blue;
      a {
        width: 100%;
        display: inline-block;
        padding: 0% 0%;
        text-align: right;
        margin-bottom: 4%; // border:1px solid red;
        span {
          display: inline-block;
          font-size: 13px;
          color: #666;
          i {
            font-size: 14px;
            color: #f35833;
          }
        }
        img {
          width: 3%;
          margin-left: 18%;
        }
      }
      a:nth-child(3) {
        text-align: center;
      }
    }
  }
  .item2 {
    width: 100%;
    height: 130px;
    border-bottom: 10px solid #eaeaea;
    ul {
      width: 100%;
      height: 120px;
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center; // border:1px solid red;
      li {
        width: 30%;
        height: 90%;
        background: url(../../static/img/item2_bg.png) 100% 100% no-repeat;
        background-size: 100% 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; // border:1px solid red;
        p:nth-child(1) {
          font-size: 13px;
          color: #333;
        }
        p:nth-child(2) {
          font-size: 20px;
          color: #666;
          margin-top: 3%;
        }
        p:nth-child(3) {
          font-size: 13px;
          color: #333;
          margin-top: 3%;
          i {
            color: #f35833;
          }
        }
      }
      li:nth-child(2) {
        margin-left: 2%;
      }
      li:nth-child(3) {
        margin-left: 2%;
      }
    }
  }
  .item3 {
    width: 100%;
    height: 75px;
    border-bottom: 10px solid #eaeaea;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item3_l {
      width: 55%;
      margin-left: 3%;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: center; // border:1px solid red;
      p {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 13px;
        color: #333;
        i {
          font-family: Arial, Helvetica, sans-serif;
          display: inline-block;
          padding: 0px 6px;
          font-size: 13px;
          color: #fff;
          border-radius: 10px;
          background: #f35833;
          text-align: center;
          margin-left: 2%; // border:1px solid red;
        }
        img {
          width: 5px;
          margin-right: 2%;
        }
      }
      p:nth-child(1) {
        font-size: 16px;
        color: #333;
        margin-bottom: 4%;
      }
    }
    .item3_r {
      width: 33%; // border:1px solid red;
      margin-right: 3%;
      img {
        width: 100%;
        height: 90%;
        margin-top: 5%;
      }
    }
  }
  .item4 {
    width: 100%;
    height: 160px;
    border-bottom: 10px solid #eaeaea;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    ul {
      width: 100%;
      height: 100%;
      li {
        width: 100%;
        height: 25%;
        padding: 0 2%;
        margin: 0 auto;
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        p:nth-child(1) {
          font-size: 14px;
          color: #333;
          img {
            width: 16px;
          }
        }
        p:nth-child(2) {
          font-size: 12px;
          color: #666;
          img {
            height: 5px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .item5 {
    width: 100%;
    height: 90px;
    border-bottom: 10px solid #eaeaea;
    ul {
      width: 100%;
      height: 100%;
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      li {
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 50%;
        }
        p {
          font-size: 12px;
          color: #333;
          margin-top: 5%;
        }
      }
    }
  }
}
</style>

<template>
  <div>
    <!-- 头部: Mint-Header 组件 -->
    <mt-header fixed :title="title"></mt-header>
    <!-- 内容容器 -->
    <div class="g-content up">
      <div class="m-index-tab">
        <div class="item1">
          <div class="item1_l">
            <span>潜客</span>
            <span>800</span>
          </div>
          <div class="item1_r">
            <a href="#">
              <span>新增&nbsp;
                <i>275</i>
              </span><img src="../../static/img/item1_dian.png" alt=""></a>
            <a href="#">
              <span>交车&nbsp;
                <i>85</i>
              </span><img src="../../static/img/item1_dian.png" alt=""></a>
            <a href="#">
              <span>战败&nbsp;
                <i>22</i>
              </span>
            </a>
          </div>
        </div>
        <div class="item2">
          <ul>
            <li>
              <p>在线报名</p>
              <p>1000</p>
              <p>今日新增&nbsp;
                <i>99</i>
              </p>
            </li>
            <li>
              <p>微信对话</p>
              <p>80</p>
              <p>待处理&nbsp;
                <i>99</i>
              </p>
            </li>
            <li>
              <p>活跃客户</p>
              <p>80</p>
              <p>今日新增&nbsp;
                <i>99</i>
              </p>
            </li>
          </ul>
        </div>
        <div class="item3">
          <div class="item3_l">
            <p>站内信
              <i>99</i>
            </p>
            <p><img src="../../static/img/item3_red.png" alt="">[黄晓米] 请您审核下优惠期活动的...</p>
          </div>
          <div class="item3_r"><img src="../../static/img/item3_phone.png" alt=""></div>
        </div>
        <div class="item4">
          <ul>
            <li>
              <p><img src="../../static/img/item4_1.png" alt="">&nbsp;&nbsp;回访</p>
              <p><img src="../../static/img/item4_5.png" alt="">15/50</p>
            </li>
            <li>
              <p><img src="../../static/img/item4_2.png" alt="">&nbsp;&nbsp;邀约</p>
              <p><img src="../../static/img/item4_5.png" alt="">15/50</p>
            </li>
            <li>
              <p><img src="../../static/img/item4_3.png" alt="">&nbsp;&nbsp;到店</p>
              <p><img src="../../static/img/item4_5.png" alt="">15/50</p>
            </li>
            <li>
              <p><img src="../../static/img/item4_4.png" alt="">&nbsp;&nbsp;交车</p>
              <p><img src="../../static/img/item4_5.png" alt="">15/50</p>
            </li>
          </ul>
        </div>
        <div class="item5">
          <ul>
            <li><img src="../../static/img/item5_1.png" alt="">
              <p>扫一扫</p>
            </li>
            <li><img src="../../static/img/item5_2.png" alt="">
              <p>二维码</p>
            </li>
            <li><img src="../../static/img/item5_3.png" alt="">
              <p>新增客户</p>
            </li>
            <li><img src="../../static/img/item5_4.png" alt="">
              <p>群发消息</p>
            </li>
            <li><img src="../../static/img/item5_5.png" alt="">
              <p>待建档</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 底部 Tab: Mint-Tabbar 组件 v-model="selected"-->
    <mt-tabbar>
      <mt-tab-item id="首页">
        <img slot="icon" src="../assets/tab-icons/tab-home.png"> 首页
      </mt-tab-item>
      <mt-tab-item id="业务">
        <img slot="icon" src="../assets/tab-icons/tab-work.png"> 业务
      </mt-tab-item>
      <mt-tab-item id="客户">
        <img slot="icon" src="../assets/tab-icons/tab-client.png"> 客户
      </mt-tab-item>
      <mt-tab-item id="对话">
        <img slot="icon" src="../assets/tab-icons/tab-message-active.png"> 对话
      </mt-tab-item>
      <mt-tab-item id="我">
        <img slot="icon" src="../assets/tab-icons/tab-me.png"> 我
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>

/**
 * 客户列表组件
 */
export default {
  name: 'IndexTab',
  data() {
    return {
      title: '首页'
    }
  }
}
</script>

