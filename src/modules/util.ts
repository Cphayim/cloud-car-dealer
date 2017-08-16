/**
 * 对象合并（浅复制）
 */
export const extend = function () {
  let length = arguments.length;
  if (!length) return null;
  if (length === 1) return arguments[0];
  for (let i = 0; i < length; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key) === true) { //此处hasOwnProperty是判断自有属性，使用 for in 循环遍历对象的属性时，原型链上的所有属性都将被访问会避免原型对象扩展带来的干扰
        arguments[0][key] = arguments[i][key];
      }
    }
  }
  return arguments[0];
}

/**
 * 格式化日期
 */
export const dateFormat = function (fmt = 'yyyy-MM-dd hh:mm:ss', date = new Date()) { //author: meizz 
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
