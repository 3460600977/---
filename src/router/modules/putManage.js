/**
 * 投放管理
 */
export const putManageRouter = [
  // 投放管理
  {
    path: '/putManage',
    component: () => import ('@/views/putManage/Index'),
    meta: {code: '1300'},
  },
  
  // 创建
  {
    path: '/putManage/create',
    component: () => import ('@/views/putManage/create/Index'),
    meta: {code: '1310'},
    children: [
      //默认创建路径
      {
        path: '/',
        component: () => import ('@/views/putManage/create/modules/plan/Plan'),
        meta: {code: '1310'},
      },
      // 创建计划
      {
        path: '/putManage/create/plan',
        component: () => import ('@/views/putManage/create/modules/plan/Plan'),
        meta: {code: '1310'},
      },
      // 创建方案
      {
        path: '/putManage/create/project',
        component: () => import ('@/views/putManage/create/modules/project/Project'),
        meta: {code: '1320'},
      },
      // 确认并支付
      {
        path: '/putManage/create/payConfirm',
        component: () => import ('@/views/putManage/create/modules/payConfirm/PayConfirm'),
        meta: {code: '1330'},
      },
      // 创建创意
      {
        path: '/putManage/create/creative',
        component: () => import ('@/views/putManage/create/modules/creative/Creative'),
        meta: {code: '1340'},
      },
    ]
  }
]
