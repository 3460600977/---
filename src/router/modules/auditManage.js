/**
 * 审核管理
 */
export const auditManageRouter = [
  // 审核管理--列表
  {
    path: '/auditList',
    component: () => import('@/views/auditManage/list/index'),
    meta: {code: '1600', name: '审核管理'},
    children: [
      //默认审核路径--创意审核列表
      {
        path: '/',
        component: () => import('@/views/auditManage/list/modules/creative/List'),
        meta: {code: '1600', name: '审核管理'},
      },
      // 创意审核列表
      {
        path: '/auditList/creative',
        component: () => import('@/views/auditManage/list/modules/creative/List'),
        meta: {code: '1610', name: '创意审核'},
      },
    ]
  },
]
