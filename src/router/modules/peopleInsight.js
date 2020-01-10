export const peopleInsightRouter = [
  {
    path: '/peopleInsight/list',
    component: () => import('@/views/peopleInsight/Index'),
    meta: {code: '1100',name: '人群洞察'},
  },

  {
    path: '/peopleInsight/createCrowd',
    component: () => import('@/views/peopleInsight/createPeoplePackage/createPeoplePackage'),
    meta: {code: '1110',name:'创建人群包'},
  },

  {
    path: '/peopleInsight/analysis',
    component: () => import('@/views/peopleInsight/peopleAnalysis/PeopleAlalysis'),
    meta: {code: '1120',name:'人群分析'},
  },

]
