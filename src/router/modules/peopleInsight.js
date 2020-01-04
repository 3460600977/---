export const peopleInsightRouter = [
  {
    path: '/peopleInsight/list',
    component: () => import('@/views/peopleInsight/Index'),
    meta: {code: '1200'},
  },

  {
    path: '/peopleInsight/createCrowd',
    component: () => import('@/views/peopleInsight/createPeoplePackage/createPeoplePackage'),
    meta: {code: '1101'},
  },

  {
    path: '/peopleInsight/analysis',
    component: () => import('@/views/peopleInsight/peopleAnalysis/PeopleAlalysis'),
    meta: {code: '1102'},
  },

]
