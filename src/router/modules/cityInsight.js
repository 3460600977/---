export const cityInsightRouter = [
  {
    path: '/cityInsight',
    component: () => import('@/views/cityInsight/cityInsight/')
  },
  {
    path: '/buildingDetail/:id',
    component: () => import('@/views/cityInsight/buildingDetail/')
  }
]
