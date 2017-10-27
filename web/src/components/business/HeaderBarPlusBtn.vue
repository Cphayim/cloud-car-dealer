<style lang="scss" scoped>
@import '../../styles/style-config.scss';
.mint-popup {
  left: auto;
  right: 5px;
  top: 50px;
  transform: translate3d(0, 0, 0);
  &::before {
    position: absolute;
    top: -8px;
    right: 10px;
    display: block;
    content: '';
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-bottom-color: rgba(32, 32, 32, 0.6);
    transform: translateY(-50%);
  }
}

.m-plus-menu {
  background-color: rgba(32, 32, 32, 0.6);
  border-radius: 4px;
  text-align: left;
  .item {
    padding: r(6) r(10) r(6) 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    @include font($font_small, #fff);
  }
  @for $i from 1 through 4 {
    .icon-#{$i}{
      background-image: url('../../assets/icons/header-plus-menu-#{$i}.png');
      background-repeat: no-repeat;
      background-size: 18px 18px;
      background-position: 5px center;
    }
  }
}
</style>

<template>
  <mt-button @click.stop="togglePop" slot="right">
    <img src="../../assets/icons/headerbar-add.png" width="26" height="26">
    <mt-popup v-model="isShowPop" popup-transition="popup-fade" :modal="false">
      <div class="m-plus-menu">
        <ul>
          <li @click.stop="tempLinkToOld(role === roleEnum['售后顾问']?'/UC/Customer/Create?fromT=after':'/UC/Customer/Create?fromT=pre')" class="item icon-3">新增用户</li>
          <li @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/UC/Customer/Search':(role === roleEnum['销售顾问']?'/UC/CustomerPre/Search':'/UC/CustomerAfter/Search'))" class="item icon-4">群发消息</li>
          <li @click.stop="openScan" class="item icon-1">我要扫码</li>
          <li @click.stop="tempLinkToOld(role === roleEnum['店铺管理员']?'/UC/Customer/Search':(role === roleEnum['销售顾问']?'/UC/CustomerPre/Search':'/UC/CustomerAfter/Search'))" class="item icon-2">搜&#x3000;&#x3000;索</li>
        </ul>
      </div>
    </mt-popup>
  </mt-button>
</template>

<script>
import CONFIG from '@/config/config'
export default {
  name: 'HeaderBarPlusBtn',
  data() {
    return {
      role: GLOBAL.role,
      roleEnum: CONFIG.ROLES,
      isShowPop: false
    }
  },
  methods: {
    togglePop() {
      this.isShowPop = !this.isShowPop
    },
    /**
     * 跳转到老版本(临时)
     */
    tempLinkToOld(url) {
      if (!url) return
      location.href = url
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
          }).then(res => {
            let { data } = res
            console.log(data)
            if (!data || data.Error) {
              return _this.$toast('二维码无效')
            }
            if (!data.url) return
            window.location.href = data.url
          })
        }
      })
    }
  }
}
</script>
