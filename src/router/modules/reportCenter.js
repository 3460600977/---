/**
 * 报表中心
 */
export const reportCenterRouter = [
  // 投放报表--投放计划报表
  {
    path: '/reportList',
    component: () => import('@/views/report/list/index'),
    children: [
      //默认投放报表路径--投放计划报表
      {
        path: '/',
        component: () => import('@/views/report/list/modules/plan/List')
      },
      // 投放计划报表
      {
        path: '/reportList/plan',
        component: () => import('@/views/report/list/modules/plan/List')
      },
      // 投放方案报表
      {
        path: '/reportList/project',
        component: () => import('@/views/report/list/modules/project/List')
      },
    ]
  },
  // 投放方案-某个方案的详情
  {
    path: '/reportList/projectDetail',
    component: () => import('@/views/report/projectDetail/projectDetail')
  },
]
