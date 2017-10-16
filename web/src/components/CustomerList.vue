<style lang="scss" scoped>
@import '../style/base/color.scss';
@import '../style/base/font.scss';
@import '../style/base/mixin.scss';

.m-customer-list {
  * {
    box-sizing: border-box;
  }
  .item {
    display: flex;
    padding: 10px 15px;
    border-bottom: 1px solid $borderColor;
    background-color: #fff;
    .item-l,
    .item-c,
    .item-r {
      display: flex;
      align-items: center;
    }
    .item-l {
      flex: 0 0 auto;
      padding-right: 10px;
      .avatar {
        width: 52px;
        height: 52px;
        border: 1px solid $borderColor;
        padding: 2px;
        border-radius: 50%;
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .item-c {
      overflow: hidden;
      flex: 1 1 auto;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .name-box {
        display: flex;
        align-items: center;
        width: 100%;
        overflow: hidden;
        .name,
        .nickname {
          display: inline-block;
          max-width: 50%;
          @include text-clip-single();
        }
        .name {
          font-size: $normalFont;
          color: $firstFontColor;
        }
        .nickname {
          margin-left: 5px;
          font-size: $smallFont;
          color: $secondFontColor;
          &::before {
            content: '[';
          }
          &::after {
            content: ']';
          }
        }
      }
      .content {
        width: 100%;
        margin-top: 5px;
        font-size: $smallFont;
        color: $thirdFontColor;
        @include text-clip-multi(1);
      }
    }
    .item-r {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      padding-left: 10px;
      .time{
        font-size: $smallFont;
        color: $thirdFontColor;
      }
    }
  }
}
</style>

<template>
  <div class="m-customer-list">
    <ul>
      <!-- 列表项 -->
      <li class="item">
        <!-- 左 -->
        <div class="item-l">
          <!-- 图标加载失败时使用默认头像 -->
          <div class="avatar">
            <img src="https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg" alt="Cphayim">
          </div>
        </div>
        <!-- 中 -->
         <div class="item-c">
          <div class="name-box">
            <span class="name">黄飞 </span>
            <span class="nickname">隔壁家老黄</span>
          </div>
          <p class="content">
            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</p>
          </p>
        </div> 
        <!-- 右 -->
        <div class="item-r">
          <p class="time">11:27</p>
        </div>
      </li>
      <!-- 列表项 -->
      <li class="item">
        <!-- 左 -->
        <div class="item-l">
          <!-- 图标加载失败时使用默认头像 -->
          <div class="avatar">
            <img src="https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg" alt="Cphayim">
          </div>
        </div>
        <!-- 中 -->
         <div class="item-c">
          <div class="name-box">
            <span class="name">林更新</span>
            <span class="nickname">LIN大侠</span>
          </div>
          <p class="content">
            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</p>
          </p>
        </div> 
        <!-- 右 -->
        <div class="item-r">
          <p class="time">11:27</p>
        </div>
      </li>
      <!-- 列表项 -->
      <li class="item">
        <!-- 左 -->
        <div class="item-l">
          <!-- 图标加载失败时使用默认头像 -->
          <div class="avatar">
            <img src="https://cphayim.me/wp-content/uploads/2017/05/cphayim-avatar-2017.jpg" alt="Cphayim">
          </div>
        </div>
        <!-- 中 -->
         <div class="item-c">
          <div class="name-box">
            <span class="name">张惠妹</span>
            <span class="nickname">阿妹 </span>
          </div>
          <p class="content">
            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</p>
          </p>
        </div> 
        <!-- 右 -->
        <div class="item-r">
          <p class="time">11:27</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
/**
 * 客户列表组件
 */
export default {
  name: 'CustomerList'
}
</script>

