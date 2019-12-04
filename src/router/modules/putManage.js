/**
 * 投放管理
 */
export const putManageRouter = [
  // 投放计划列表
  // {
  //   path: '/plan/list',
  //   component: () => import ('@/views/putManage/index'),
  // },
  // 投放方案列表
  {
    path: '/project/list',
    component: () => import ('@/views/putManage/list/modules/project/List'),
  },
  // 广告创意列表
  {
    path: '/creative/list',
    component: () => import ('@/views/putManage/list/modules/creative/List'),
  },
  
  // 投放管理
  {
    path: '/putManage',
    component: () => import ('@/views/putManage/Index'),
  },

  // 创建
  {
    path: '/putManage/create',
    component: () => import ('@/views/putManage/create/Index'),
    children: [
      // 创建计划
      {
        path: '/putManage/create/plan',
        component: () => import ('@/views/putManage/create/modules/plan/plan'),
      },
      // 创建创意
      {
        path: '/putManage/create/creative',
        component: () => import ('@/views/putManage/create/modules/creative/creative'),
      },
    ]
  }
]
