// 投放管理
export const putManageRouter = [
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
  }
]
