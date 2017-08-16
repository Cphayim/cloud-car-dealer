import BasePage from '../../basepage';
/*
 * 任务页逻辑
 * @Author: 云程科技 
 * @Date: 2017-07-11 15:49:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-08-14 13:02:32
 */

// 测试数据
// 任务列表数据
const taskList = [];
const names = ['黄晓米', '林更新', '陈小飞', '张丽', '林琳', '吴伟'];
// 统计
let [progressStatistics, countStatistics] = [0, 0];
for (let n of names) {
  let obj: any = {};
  obj.name = n;
  // 随机总数
  obj.total = ~~(Math.random() * 150);
  // 完成数（总数的33%-100%之间随机数）
  obj.finished = ~~(Math.random() * obj.total * 2 / 3) + ~~(obj.total / 3);
  countStatistics += obj.total;
  progressStatistics += obj.finished;
  taskList.push(obj);
}

let percent = ~~(progressStatistics / countStatistics * 100);

class TaskPage extends BasePage {
  public data:any = {
    taskList,
    progressStatistics,
    countStatistics,
    percent
  }

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 修改 导航栏标题
    const title = decodeURI(options.title);
    wx.setNavigationBarTitle({ title })
  }
  onReady() {

  }
  onShow() {

  }
  onHide() {

  }
  onUnload() {

  }
  onPullDownRefresh() {

  }
  onReachBottom() {

  }
  onShareAppMessage() {

  }
}

Page(new TaskPage());
