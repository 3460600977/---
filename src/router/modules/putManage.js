// 投放管理
export const putManageRouter = [
  // 投放管理-投放计划
  {
    path: '/plan/list',
    component: () => import ('@/views/putManage/list/modules/plan/List'),
  },
  // 投放管理-投放方案
  {
    path: '/project/list',
    component: () => import ('@/views/putManage/list/modules/project/List'),
  },
  // 投放管理-广告创意
  {
    path: '/creative/list',
    component: () => import ('@/views/putManage/list/modules/creative/List'),
  },
  {
    path: '/putManage',
    component: () => import ('@/views/putManage/Index'),
    children: [
      {
        path: '/putManage/createCreative',
        component: () => import ('@/views/putManage/create/modules/createCreative'),
      }
    ]
  },
]
