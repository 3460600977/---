export const scaleData =[
  {zoom:19 ,length:20 ,Pixels:48},
  {zoom:18 ,length:50 ,Pixels:61},
  {zoom:17 ,length:100 ,Pixels:61},
  {zoom:16 ,length:200 ,Pixels:61},
  {zoom:15 ,length:500 ,Pixels:78},
  {zoom:14 ,length:1000 ,Pixels:78},
  {zoom:13 ,length:2000 ,Pixels:78},
  {zoom:12 ,length:5000 ,Pixels:99},
  {zoom:11 ,length:10000 ,Pixels:99},
  {zoom:10 ,length:20000 ,Pixels:99},
  {zoom:9 ,length:25000 ,Pixels:59},
  {zoom:8 ,length:50000 ,Pixels:59},
  {zoom:7 ,length:100000 ,Pixels:59},
  {zoom:6 ,length:200000 ,Pixels:59},
  {zoom:5 ,length:500000 ,Pixels:76},
  {zoom:4 ,length:1000000 ,Pixels:76},
  {zoom:3 ,length:2000000 ,Pixels:75}
]

export const colorMain = '#2D5AFF'

// 创建方案所需常量
export const projectConst = {
  // 投放类型，0按周投放，1按天投放
  putType: [
    { name: '按周投放', value: 0},
    { name: '按天投放', value: 1}
  ],

  // 投放方式
  putWay: [
    { name: '一个楼盘所有点位', value: '001' },
    { name: '一个单元一个电梯', value: '002' },
    { name: '一个单元一半电梯', value: '003' }
  ],

  // 投放频次，001-300次/天，002-600次/天，003-900次/天 依次类推
  putFrequency: [
    { name: '300 次/天', value: '001' },
    { name: '600 次/天', value: '002' },
    { name: '900 次/天', value: '003' }
  ],

  // 投放时长，001-5s/次，002-10s/次，003-15s/次 依次类推
  putDuration: [
    { name: '5 秒/次',  value: '001', creativeVal: 0 },
    { name: '10 秒/次', value: '002', creativeVal: 1 },
    { name: '15 秒/次', value: '003', creativeVal: 2 }
  ],

  // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
  screenType: [
    { name: '上屏', value: '001', creativeVal: 0 },
    { name: '下屏', value: '002', creativeVal: 1 },
    { name: '联动', value: '003', creativeVal: 2 }
  ]
}

// 第三方监测
export const MonitorData = {
  mode: ['SDK'],
  thirdPartyMonitor: [
    { name: '酷云', value: 'ky' }, 
    { name: '秒针', value: 'mz' }, 
  ]
}

// 上屏文件类型，1：视频,2:图片
export const fileType = [
  { name: '上传视频', value: 1},
  { name: '上传图片', value: 2},
]

// 投放目的
export const PutGoal = [
  { name: '品牌宣传', value: 0, icon: require('../assets/images/plan_title_1.png')},
  { name: '新品上线', value: 1, icon: require('../assets/images/plan_title_2.png')},
  { name: '活动宣传', value: 2, icon: require('../assets/images/plan_title_3.png')},
  { name: '其他',     value: 3, icon: require('../assets/images/plan_title_4.png')}
]

// 投放预算分类
export const Budget = [
  { name: '不限', value: 0 },
  { name: '指定预算', value: 1 }
]
export const PAGE_SIZE = [10, 20, 30, 40, 50]
