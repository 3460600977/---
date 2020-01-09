/**
 * 工具箱
 */
export const toolBoxRouter = [
  {
    path: '/home/account',
    component: () => import('@/views/toolBox/manage/index'),
    meta: {code: '1010',name:'账号管理信息'},
    children: [
      //默认账号管理路径---
      {
        path: '/',
        component: () => import('@/views/toolBox/manage/modules/account/Info'),
        meta: {code: '1010',name:'账号管理信息'},
      },
    ]
  },
]

