export const scaleData = [
  {zoom: 19, length: 20, Pixels: 48},
  {zoom: 18, length: 50, Pixels: 61},
  {zoom: 17, length: 100, Pixels: 61},
  {zoom: 16, length: 200, Pixels: 61},
  {zoom: 15, length: 500, Pixels: 78},
  {zoom: 14, length: 1000, Pixels: 78},
  {zoom: 13, length: 2000, Pixels: 78},
  {zoom: 12, length: 5000, Pixels: 99},
  {zoom: 11, length: 10000, Pixels: 99},
  {zoom: 10, length: 20000, Pixels: 99},
  {zoom: 9, length: 25000, Pixels: 59},
  {zoom: 8, length: 50000, Pixels: 59},
  {zoom: 7, length: 100000, Pixels: 59},
  {zoom: 6, length: 200000, Pixels: 59},
  {zoom: 5, length: 500000, Pixels: 76},
  {zoom: 4, length: 1000000, Pixels: 76},
  {zoom: 3, length: 2000000, Pixels: 75}
]

export const colorMain = '#2D5AFF'

// 创建方案所需常量
export const projectConst = {
  // 投放类型，0按周投放，1按天投放
  putType: [
    {name: '按周投放', value: 0},
    {name: '按天投放', value: 1}
  ],
  
  // 投放方式
  putWay: [
    {name: '一个楼盘所有点位', value: '001'},
    {name: '一个单元一个电梯', value: '002'},
    {name: '一个单元一半电梯', value: '003'}
  ],
  
  // 投放频次，001-300次/天，002-600次/天，003-900次/天 依次类推
  putFrequency: [
    {name: '300 次/天', value: '001'},
    {name: '600 次/天', value: '002'},
    {name: '900 次/天', value: '003'}
  ],
  
  // 投放时长，001-5s/次，002-10s/次，003-15s/次 依次类推
  putDuration: [
    {name: '5 秒/次', value: '001', creativeVal: 0},
    {name: '10 秒/次', value: '002', creativeVal: 1},
    {name: '15 秒/次', value: '003', creativeVal: 2}
  ],
  
  // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
  screenType: [
    {name: '联动', value: '003', creativeVal: 2},
    {name: '上屏', value: '001', creativeVal: 0},
    {name: '下屏', value: '002', creativeVal: 1}
  ]
}

// 第三方监测
export const MonitorData = {
  mode: ['SDK'],
  thirdPartyMonitor: [
    {name: '酷云', value: 'ky'},
    {name: '秒针', value: 'mz'},
  ]
}

// 上屏文件类型，1：视频,2:图片
export const fileType = [
  {name: '上传视频', value: 1},
  {name: '上传图片', value: 2},
]

// 投放目的
export const PutGoal = [
  {name: '品牌宣传', value: 0, icon: require('../assets/images/plan_title_1.png')},
  {name: '产品促销', value: 1, icon: require('../assets/images/plan_title_2.png')},
  {name: '到店引流', value: 2, icon: require('../assets/images/plan_title_3.png')},
  {name: '搜索热度提升', value: 3, icon: require('../assets/images/plan_title_4.png')},
  {name: '新品上市', value: 4, icon: require('../assets/images/plan_title_4.png')}
]

// 投放预算分类
export const Budget = [
  {name: '不限', value: 0},
  {name: '指定预算', value: 1}
]
export const PAGE_SIZE = [10, 20, 30, 40, 50]

// 审核拒绝原因
export const DenyDialogReason = [
  {
    title: '效果承诺',
    reasons: [
      {
        value: '不得含有对未来效果、收益或者与其相关的情况作出保证性承诺，明示或者暗示保本、无风险或者保收益等内容'
      },
      {
        
        value: '不得涉及前后效果对比'
      },
      {
        
        value: '不得对升学，提高成绩，拿证或培训效果作出保证性承诺'
      },
      {
        value: '不得以受益人，专家学者等机构的名义推广'
      },
      {
        value: '涉及虚假误导宣传'
      },
    ]
  },
  {
    title: '政治面貌敏感，极端词语类',
    reasons: [
      {
        value: '不得使用或者变相使用中华人民共和国的国旗、国歌、国徽、军旗、军歌、军徽'
      },
      {
        value: '不得使用”国家级””最高级””最佳”等极端用语'
      },
      {
        value: '不得含有污秽、色情、赌博、迷信、恐怖、暴力的内容'
      },
      {
        value: '含有名族、种族、宗教、性别歧视的内容'
      },
      {
        value: '不得涉及时事热点政治敏感内容'
      },
      {
        value: '不得使用国家机关或国家机关工作人员的形象名义作为推广'
      },
    ]
  },
  
  {
    title: '风险提示类',
    reasons: [
      {
        value: '请在画面添加备注预售号'
      },
      {
        
        value: '涉及招商加盟，请备注风险提示语：“投资有风险，加盟需谨慎”'
      },
      {
        value: '画面请备注风险提示语“投资有风险”'
      },
    ]
  },
  {
    title: '素材质量类',
    reasons: [
      {
        value: '素材画面整体质量较低'
      },
      {
        value: '画面内容容易引起不适，易引起投诉'
      },
      {
        value: '请合理规范使用标点符号'
      },
    ]
  },
  {
    title: '医疗行业类',
    reasons: [
      {
        value: '不得涉及真人医患形象，真人代言，医疗器械，手术直播过程'
      },
      {
        value: '非医疗行业不得涉及医疗相关描述'
      },
      {
        value: '请在画面添加备注医广号'
      },
    ]
  },
  {
    title: '暂不接受投放类',
    reasons: [
      {
        value: '暂不接受该行业投放，请知悉'
      },
    ]
  },
]

// 菜单栏展示
export const MenuList = [
  {code: '1000', path: '/',children:[]},
  {code: '1100', path: '/cityInsight'},
  {code: '1200', path: '/putManage'},
  {code: '1300', path: '/reportList'},
  {code: '1400', path: '/toolBox',},
  {code: '1500', path: '/auditList',}
]


