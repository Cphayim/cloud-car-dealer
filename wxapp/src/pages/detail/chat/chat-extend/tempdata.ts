// 临时测试数据
const tempData:any = {
    // 对话模板
    msgtpl: [{
        // 渲染到 顶部 Tab
        tabTitle: '推荐模板',
        // 列表类型，决定了渲染出来的样式布局
        // 可选值 'text':文字列表、'graphic':图文列表、'tickt':票券列表
        listType: 'text',
        // 列表项，视图层根据列表类型选择对应的模板渲染，多余的项会被忽略
        items: [{
                id: 101,
                // 标题
                title: '',
                // 内容
                content: '亲，很高兴为您服务,请问有什么可以帮助您的吗？很高兴为您服务,请问有什么可以帮助您的吗？',
                label: ''
            },
            {
                id: 102,
                title: '',
                content: '您好，欢迎光临XX店！现在由我为您服务。请问有什么可以为您服务的吗？'
            },
            {
                id: 103,
                title: '',
                content: '亲，您说的我的确无法办到。希望我下次能帮到您。 '
            },
            {
                id: 104,
                title: '',
                content: '亲，您的眼光真不错，我个人也很喜欢您选的这款。'
            },
            {
                id: 105,
                title: '',
                content: '真佩服您的眼光，这是我们的新款，卖得非常好！'
            }
        ]
    }, {
        tabTitle: '对话模板',
        listType: 'text',
        items: [{
                id: 105,
                title: '',
                content: '您好，我是 XX，您的销售顾问'
            },
            {
                id: 106,
                title: '',
                content: '好的，马上为您办理'
            },
            {
                id: 107,
                title: '',
                content: '再见'
            }
        ]
    }],
    // 商家位置
    position: [{
        tabTitle: '商家位置',
        listType: 'text',
        items: [{
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }, {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            },
            {
                title: '福州云程信息科技有限公司',
                content: '福州市仓山区奋安创意产业园D西2楼'
            }
        ]
    }],
    // 问卷调查
    questionnaire: [{
        tabTitle: '问卷调查',
        listType: 'text',
        items: [{
                content: '【售前】动动手中秋月饼就是你的'
            },
            {
                content: '【售前】动动手中秋月饼就是你的'
            },
            {
                content: '【售前】动动手中秋月饼就是你的'
            }
        ]
    }],
    game: [{
        tabTitle: '游戏',
        listType: 'text',
        items: [{
            content: '【众筹】动动手中秋月饼就是你的'
        }, {
            content: '【加油卡】动动手中秋月饼就是你的'
        }, {
            content: '【戳一戳】动动手中秋月饼就是你的'
        }]
    }],
    coupons: [{
        tabTitle: '优惠券',
        listType: 'ticket',
        items: [{
            title: '购车优惠「福建吉诺」首付一成, 助你轻松购车',
            type: '普通券',
            time: ' 14/11/11 - 15/02/14'
        }, {
            title: '购车优惠「福建吉诺」首付一成, 助你轻松购车',
            type: '普通券',
            time: ' 14/11/11 - 15/02/14'
        }]
    }, {
        tabTitle: '优惠活动',
        listType: 'text',
        items: [{
            title: '【云程】周年庆活动，各种送人头',
            time: ' 14/11/11 - 15/02/14'
        }, {
            title: '【云程】周年庆活动，各种送人头',
            time: ' 14/11/11 - 15/02/14'
        }, {
            title: '【云程】周年庆活动，各种送人头',
            time: ' 14/11/11 - 15/02/14'
        }, {
            title: '【云程】周年庆活动，各种送人头',
            time: ' 14/11/11 - 15/02/14'
        }, {
            title: '【云程】周年庆活动，各种送人头',
            time: ' 14/11/11 - 15/02/14'
        }]
    }]
};

const activity = []
const tabTitles = ['新车', '二手车', '精品', '售后', '资讯'];

for (let v of tabTitles) {
    let obj:any = {

    }
    obj.tabTitle = v;
    obj.listType = 'graphic';
    obj.items = [];

    let random = ~~(Math.random() * 8) + 1;
    for (let i = 0; i < random; i++) {
        let item = {
            image:'',
            title: `【${v}】活动进行中${i}`,
            starttime: '',
            endtime: '2017/06/23  10:10',
        };
        obj.items.push(item);
    }
    activity.push(obj);
}

tempData.activity = activity;

export default tempData