export const cityInsightRouter = [
  {
    path: '/cityInsight/selectPoint',
    component: () => import('@/views/cityInsight/cityInsight/'),
    meta: {code: '1201'},
  },
  // 资源包
  {
    path: '/cityInsight/list',
    component: () => import('@/views/toolBox/resourceBundle/'),
    meta: {code: '1200'},
  },
  {
    path: '/buildingDetail/:id',
    component: () => import('@/views/cityInsight/buildingDetail/')
  },
  {
    path: '/chinaMap',
    component: () => import('@/views/cityInsight/chinaMap/')
  }
]
