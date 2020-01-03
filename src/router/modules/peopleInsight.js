export const peopleInsightRouter = [
  {
    path: '/peopleInsight',
    component: () => import('@/views/peopleInsight/Index'),
    meta: {code: '1200'},
  },
  
  {
    path: '/createPeoplePackage',
    component: () => import('@/views/peopleInsight/createPeoplePackage/createPeoplePackage'),
    meta: {code: '1101'},
  },
  
  {
    path: '/peopleAnalysis',
    component: () => import('@/views/peopleInsight/peopleAnalysis/PeopleAlalysis'),
    meta: {code: '1102'},
  },

]
