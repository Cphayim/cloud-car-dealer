/**
 * 对象合并（浅复制）
 */
export function extend() {
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
 * @export
 * @param {string} [fmt='yyyy-MM-dd hh:mm:ss'] 
 * @param {Date} [date=new Date()] 
 * @returns 
 */
export function dateFormat(fmt: string = 'yyyy-MM-dd hh:mm:ss', date: Date = new Date()) { //author: meizz 
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

/**
 * 获取当月第一天和最后一天的字符串 'yyyy-MM-dd'
 * @export
 * @param {Date} currentDate 
 * @returns 
 */
export function getFirstAndLastMonthDay(currentDate: Date = new Date()) {
    const year = currentDate.getFullYear(),
        month = currentDate.getMonth() + 1;
        console.log(new Date('2017-08-23'));
    const firstdate = dateFormat('yyyy-MM-dd 0:00:00', new Date(year + '/' + month + '/01'));
    const day = new Date(year, month, 0);
    const lastdate = dateFormat('yyyy-MM-dd 23:59:59', new Date(year + '/' + month + '/' + day.getDate()));//获取当月最后一天日期
    //给文本控件赋值。同下
    return { firstdate, lastdate };
}


export const listTimeFormat = (function () {
    // 获取当前时间
    const currentDate: Date = new Date();
    const currentYear: number = currentDate.getFullYear();
    const currentMonth: number = currentDate.getMonth() + 1;
    const currentDay: number = currentDate.getDate();

    /**
     * 格式化列表时间
     * @param item 
     * @param timeName 
     */
    return function (oldTimeStr: string): string {
        if(!oldTimeStr) return '';
        const date: Date = new Date(oldTimeStr);
        const year: number = date.getFullYear();
        const month: number = date.getMonth() + 1;
        const day: number = date.getDate();

        let newTimeStr: string = '';

        // 如果是今天显示时间
        if (year === currentYear && month === currentMonth && day === currentDay) {
            newTimeStr = dateFormat('hh:mm', new Date(oldTimeStr));
        }
        // 否则显示日期
        // 当月
        else if (year === currentYear && month === currentMonth) {
            let dis = currentDay - day;
            // 昨天
            if (dis === 1) {
                newTimeStr = dateFormat('昨天', new Date(oldTimeStr));
            }
            // 前天
            else if (dis === 2) {
                newTimeStr = dateFormat('前天', new Date(oldTimeStr));
            } else {
                newTimeStr = dateFormat('MM-dd', new Date(oldTimeStr));
            }
        }
        // 同年
        else if (year === currentYear) {
            newTimeStr = dateFormat('MM-dd', new Date(oldTimeStr));
        }
        // 其它
        else {
            newTimeStr = dateFormat('yyyy-MM-dd', new Date(oldTimeStr));
        }
        return newTimeStr;
    }
})();
