export const cityInsightRouter = [
  {
    path: '/cityInsight',
    component: () => import('@/views/cityInsight/cityInsight/'),
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
