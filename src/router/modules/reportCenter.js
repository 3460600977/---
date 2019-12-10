/**
 * 报表中心
 */
export const reportCenterRouter = [
  // 投放报表--投放计划报表
  {
    path: '/reportList',
    component: () => import('@/views/report/list/index'),
    children: [
      // 投放计划报表
      {
        path: '/reportList/plan',
        component: () => import('@/views/report/list/modules/plan/list')
      },
      // 投放方案报表
      {
        path: '/reportList/project',
        component: () => import('@/views/report/list/modules/project/list')
      },
    ]
  },
  // 投放方案-某个方案的详情
  {
    path: '/reportList/projectDetail',
    component: () => import('@/views/report/projectDetail/projectDetail')
  },
]
