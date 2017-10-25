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

// 顾问
app.get('/Report/Statistic/GetEmployeeTotal', (req, res) => {
  const { isNew, r } = req.query
  let num = Math.round(r)
  let data
  if (num) {
    // 销售
    data = JSON.parse('{"OpenId":"","TenantId":340,"Role":"WX_Sales","Name":"钟-销售顾问","Id":"ed0f77ec-1020-4598-9aa7-c95b38e34426","MyCustomerPre":314,"MyCustomerPreIncreased":7,"MyCustomerPreUnIncreased":6,"MyDeliverCarMonthCount":1,"MyDefeatCount":1,"GroupCustomerPre":0,"GroupCustomerPreIncreased":0,"GroupCustomerPreUnIncreased":336,"GroupDeliverCarCount":0,"GroupDeliverAllCount":0,"GroupDefeatCount":0,"GroupMonthDeliverCarCount":0,"MyCustomerAfter":0,"MyCustomerAfterUnassign":0,"MyCustomerAfterUndeal":0,"TenantCustomerAfter":0,"TenantCustomerAfterUnassign":0,"TenantCustomerAfterUndeal":0,"GroupCustomerAfter":0,"GroupCustomerAfterUndeal":0,"MyBusinessPre":189,"MyBusinessAfter":0,"MyMaintain":0,"GroupMaintain":0,"MyReinsurance":0,"GroupReinsurance":0,"MyBusinessPreUndeal":57,"MyBusinessAfterUndeal":0,"MyMaintainUndeal":0,"GroupMaintainUndeal":0,"MyReinsuranceUndeal":0,"GroupReinsuranceUndeal":0,"GroupBusinessPre":0,"GroupBusinessAfter":0,"GroupBusinessPreUndeal":0,"GroupBusinessAfterUndeal":0,"MyMessage":60,"MyMessageUnreply":4,"GroupMessage":0,"GroupMessageAfter":0,"GroupMessageUnreply":0,"GroupMessageAfterUnreply":0,"MyActiveCustomer":7,"MyActiveCustomerUndeal":80,"GroupActiveCustomer":0,"GroupActiveCustomerUndeal":0,"GroupActiveCustomerAfter":0,"GroupActiveCustomerAfterUndeal":0,"SOSMessageTotal":0,"SOSMessageUndeal":0,"MyVisitTotal":0,"MyNoVisitTotal":59,"GroupNoVisitTotal":0,"MyDeliverCarCount":0,"MyDeliverAllCount":25,"MyBirthdayCount":0,"GroupBirthdayCount":0,"MyNeedMaintain":0,"GroupNeedMaintain":0,"MyNeedReinsurance":0,"GroupNeedReinsurance":0,"MyNeedInspection":0,"GroupNeedInspection":0,"MySaleGoal":6,"MySignGoal":1,"GroupSaleGoal":10,"GroupSignGoal":0,"MyFollowTargetGoal":10,"MyFollowTargetGoalSignGoal":1,"GroupFollowTargetGoal":10,"GroupFollowTargetGoalSignGoal":1,"GroupAfterFollowTargetGoal":0,"MyEvaluationTotal":42,"MyEvaluationSumScore":33,"GroupEvaluationTotal":0,"GroupEvaluationSumScore":0,"GroupVisitTotal":0,"EmployeeMessageTotal":496,"TodayOrderDeal":0,"TodayOrderDealAmount":0.00,"MaintainUndeal":0,"ServiceMessageUnReply":0}')
  } else {
    // 售后
    data = JSON.parse('{"OpenId":null,"TenantId":340,"Role":"WX_Service","Name":"钟-售后顾问","Id":"7e420c02-fb87-4123-8b4e-266590154281","MyCustomerPre":0,"MyCustomerPreIncreased":0,"MyCustomerPreUnIncreased":0,"MyDeliverCarMonthCount":0,"MyDefeatCount":0,"GroupCustomerPre":0,"GroupCustomerPreIncreased":0,"GroupCustomerPreUnIncreased":0,"GroupDeliverCarCount":0,"GroupDeliverAllCount":0,"GroupDefeatCount":0,"GroupMonthDeliverCarCount":0,"MyCustomerAfter":155,"MyCustomerAfterUnassign":1,"MyCustomerAfterUndeal":117,"TenantCustomerAfter":482,"TenantCustomerAfterUnassign":199,"TenantCustomerAfterUndeal":183,"GroupCustomerAfter":0,"GroupCustomerAfterUndeal":0,"MyBusinessPre":0,"MyBusinessAfter":36,"MyMaintain":55,"GroupMaintain":0,"MyReinsurance":0,"GroupReinsurance":0,"MyBusinessPreUndeal":0,"MyBusinessAfterUndeal":15,"MyMaintainUndeal":3,"GroupMaintainUndeal":0,"MyReinsuranceUndeal":0,"GroupReinsuranceUndeal":0,"GroupBusinessPre":0,"GroupBusinessAfter":0,"GroupBusinessPreUndeal":0,"GroupBusinessAfterUndeal":0,"MyMessage":31,"MyMessageUnreply":3,"GroupMessage":0,"GroupMessageAfter":0,"GroupMessageUnreply":0,"GroupMessageAfterUnreply":0,"MyActiveCustomer":8,"MyActiveCustomerUndeal":35,"GroupActiveCustomer":0,"GroupActiveCustomerUndeal":0,"GroupActiveCustomerAfter":0,"GroupActiveCustomerAfterUndeal":0,"SOSMessageTotal":22,"SOSMessageUndeal":7,"MyVisitTotal":0,"MyNoVisitTotal":0,"GroupNoVisitTotal":0,"MyDeliverCarCount":0,"MyDeliverAllCount":0,"MyBirthdayCount":3,"GroupBirthdayCount":0,"MyNeedMaintain":0,"GroupNeedMaintain":0,"MyNeedReinsurance":2,"GroupNeedReinsurance":0,"MyNeedInspection":1,"GroupNeedInspection":0,"MySaleGoal":0,"MySignGoal":0,"GroupSaleGoal":0,"GroupSignGoal":0,"MyFollowTargetGoal":2,"MyFollowTargetGoalSignGoal":0,"GroupFollowTargetGoal":0,"GroupFollowTargetGoalSignGoal":0,"GroupAfterFollowTargetGoal":4,"MyEvaluationTotal":12,"MyEvaluationSumScore":6,"GroupEvaluationTotal":0,"GroupEvaluationSumScore":0,"GroupVisitTotal":0,"EmployeeMessageTotal":65,"TodayOrderDeal":0,"TodayOrderDealAmount":0.00,"MaintainUndeal":0,"ServiceMessageUnReply":0}')
  }

  res.json(data)
})

app.get('/Car/ShareInfos/ReadForArticle', (req, res) => {
  res.json([{ Title: 'Mock 数据' }])
})

app.listen(3000, _ => console.log('Server is Running.'));