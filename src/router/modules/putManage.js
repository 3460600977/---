// 投放管理
export const putManageRouter = [
  // 创建投放方案流程
  {
    path: '/flow/createplan',
    component: () => import ('@/views/putManage/flow/CreatePlan'),
  },
  {
    path: '/flow/createproject',
    component: () => import ('@/views/putManage/flow/CreateProject'),
  },
  {
    path: '/flow/confirmproject',
    component: () => import ('@/views/putManage/flow/ConfirmProject'),
  },
  {
    path: '/flow/createcreative',
    component: () => import ('@/views/putManage/flow/CreateCreative'),
  },
  // 投放管理-投放计划
  {
    path: '/plan/list',
    component: () => import ('@/views/putManage/plan/List'),
  },
  // 投放管理-投放方案
  {
    path: '/project/list',
    component: () => import ('@/views/putManage/project/List'),
  },
  // 投放管理-广告创意
  {
    path: '/creative/list',
    component: () => import ('@/views/putManage/creative/List'),
  },
  {
    path: '/creative/edit',
    component: () => import ('@/views/putManage/creative/Edit'),
  },
  {
    path: '/creative/singlecreative',
    component: () => import ('@/views/putManage/creative/SingleCreative'),
  }
]
