export const peopleInsightRouter = [
  {
    path: '/peopleInsight',
    component: () => import('@/views/peopleInsight/Index')
  },
  {
    path: '/createPeoplePackage',
    component: () => import('@/views/peopleInsight/createPeoplePackage/createPeoplePackage')
  },
]
