/**
 * 工具箱
 */
export const toolBoxRouter = [
  // 工具箱--展示账号管理，辅助功能按钮
  {
    path: '/toolBox',
    component: () => import('@/views/toolBox/index'),
  },
  // 工具箱--账号管理信息
  {
    path: '/toolBox/account',
    component: () => import('@/views/toolBox/manage/index'),
    children: [
      //默认账号管理路径---
      {
        path: '/',
        component: () => import('@/views/toolBox/manage/modules/account/Info')
      },
      // 账号信息
      {
        path: '/toolBox/accountInfo',
        component: () => import('@/views/toolBox/manage/modules/account/Info')
      },
      // 资源包
      {
        path: '/toolBox/resourceBundle',
        component: () => import('@/views/toolBox/resourceBundle/')
      },
    ]
  },
  // 工具箱--修改账号密码
  {
    path: '/toolBox/editPass',
    component: () => import('@/views/toolBox/pass/index'),
  },
]

