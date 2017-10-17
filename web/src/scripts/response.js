((doc, win) => {
  let docEl = doc.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  // alert('JSON' in window);
  // alert('accvd' in window);

  // 判断当前window有没有 orientationchange这个方法,注意方法的key用的字符串
  // orientationchange判断是否横屏
  let recalc = () => {
    let clientWidth = docEl.clientWidth
    // 如果没有获取到宽度不执行
    if (!clientWidth) return
    docEl.style.fontSize = 20 / 375 * clientWidth + 'px'
  }

  // -------------------结束----------------
  // 在我我只是定义了三个变量
  if (!doc.addEventListener) return

  win.addEventListener(resizeEvt, recalc, false)
  // 要吗是横屏事件,要不是resize事件
  doc.addEventListener('DOMContentLoaded', recalc, false)
  // 这个事件就是js版文档加载完毕调用
})(document, window)

export default 123
// 总结我就是加入横屏判断与一些兼容处理
//调整浏览器视口时触发

