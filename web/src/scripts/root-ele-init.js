/**
 * 根元素单位初始化脚本
 * By: Cphayim
 */
((w, d) => {
  let html = d.querySelector('html');
  // 设置 html 标签的字体大小为 (视口宽度 / 750 * 100)px
  // 样式文件中的单位应该设置为 (以 iPhone6 750 宽度的视觉稿测量单位(px) / 100)rem
  // 如视觉稿测量的内边距 为 30px，则设置 padding: 0.3rem; 
  html.style.fontSize = `${w.outerWidth / 750 * 100}px`;
  // 监听视口变化
  d.addEventListener('resize',
    e => html.style.fontSize = `${w.outerWidth / 750 * 100}px`,
    false);
})(window, document);