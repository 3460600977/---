/**
 * 投放管理
 */
export const putManageRouter = [
  // 投放计划列表
  {
    path: '/plan/list',
    component: () => import ('@/views/putManage/index'),
  },
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
  // 创建流程
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
