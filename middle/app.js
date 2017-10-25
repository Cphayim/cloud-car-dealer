const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  req.method == "OPTIONS" ? res.send(200) : next();
});

// 登录
app.post('/org/employee/login', (req, res) => {
  const { username, password } = req.body
  console.log(username, password)
  if (username && password) {
    res.send('null')
  }
})

// 首页数据(管理员)
app.get('/Statistic/GetTenantTotal', (req, res) => {
  const { isNew, r } = req.query
  res.json(JSON.parse('{"Customer":161,"CustomerIncreased":3,"CustomerPre":640,"CustomerPreUnassign":137,"CustomerPreIncreased":13,"DeliverCarMonthCount":13,"DefeatCount":3,"CustomerAfter":480,"CustomerAfterUnassign":199,"CustomerAfterUndeal":181,"BusinessPre":698,"BusinessAfter":130,"Maintain":110,"Reinsurance":91,"BusinessPreUndeal":394,"BusinessAfterUndeal":86,"MaintainUndeal":3,"ReinsuranceUndeal":9,"Message":106,"SaleMessage":67,"ServiceMessage":52,"MessageUnReply":2,"SaleMessageUnReply":2,"ServiceMessageUnReply":1,"ActiveCustomer":218,"SaleActiveCustomer":53,"ServiceActiveCustomer":17,"ActiveCustomerUndeal":166,"SaleActiveCustomerUndeal":158,"ServiceActiveCustomerUndeal":102,"SOSMessageTotal":22,"SOSMessageUndeal":7,"VisitTotal":0,"NoVisitTotal":202,"DeliverCarCount":0,"DeliverAllCount":45,"ServiceBirthdayCount":2,"BirthdayCount":3,"ServiceNeedMaintain":1,"NeedMaintain":2,"ServiceNeedReinsurance":3,"NeedReinsurance":6,"ServiceNeedInspection":1,"NeedInspection":1,"SaleGoal":10,"SignGoal":1,"SaleFollowTargetGoal":90,"ServiceFollowTargetGoal":10,"FollowTargetGoal":100,"SaleFollowTargetGoalSignGoal":0,"ServiceFollowTargetGoalSignGoal":0,"FollowTargetGoalSignGoal":0,"SaleEvaluationTotal":69,"ServiceEvaluationTotal":27,"EvaluationTotal":96,"SaleEvaluationSumScore":59,"ServiceEvaluationSumScore":19,"EvaluationSumScore":78,"SaleMassAuditCount":127,"ServiceMassAuditCount":4,"MassAuditCount":131,"SaleCouponCount":30,"ServiceCouponCount":30,"CouponCount":77,"RegistInfoTotal":0,"RegistInfoUndeal":0,"MemberApplyUnAudit":7,"EmployeeMessageTotal":0,"TodayOrderDeal":0,"TodayOrderDealAmount":0.0}'))
})
app.get('/Car/ShareInfos/ReadForArticle', (req, res) => {
  res.json([{Title:'Mock 数据'}])
})

app.listen(3000, _ => console.log('Server is Running.'));