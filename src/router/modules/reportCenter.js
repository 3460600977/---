/**
 * 报表中心
 */
export const reportCenterRouter = [
  // 投放报表--投放计划报表
  {
    path: '/reportList',
    component: () => import('@/views/report/list/index'),
    meta: {code: '1400', name: '报表中心'},
    children: [
      //默认投放报表路径--投放计划报表
      {
        path: '/',
        component: () => import('@/views/report/list/modules/plan/List'),
        meta: {code: '1400', name: '报表中心'}
      },
      // 投放计划报表
      {
        path: '/reportList/plan',
        component: () => import('@/views/report/list/modules/plan/List'),
        meta: {code: '1410', name: '投放计划报表'}
      },
      // 投放方案报表
      {
        path: '/reportList/project',
        component: () => import('@/views/report/list/modules/project/List'),
        meta: {code: '1420', name: '投放方案报表'},
      },
    ]
  },
  // 投放方案-某个方案的详情
  {
    path: '/reportList/projectDetail',
    component: () => import('@/views/report/projectDetail/projectDetail'),
    meta: {code: '1421', name: '投放方案详情'},
  },
]
