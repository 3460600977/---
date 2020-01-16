/**
 * 财务管理
 */
export const financeRouter = [
    {
        path: '/finance',
        component: () => import('@/views/finance/index'),
        meta: { code: '1500', name: '财务管理' },
        children: [
            //默认财务路径--账号流水列表
            {
                path: '/',
                component: () => import('@/views/finance/modules/account/flow'),
                meta: { code: '1510', name: '财务管理-账号流水' },
            },
            // 账号流水列表
            {
                path: '/finance/flow',
                component: () => import('@/views/finance/modules/account/flow'),
                meta: { code: '1510', name: '财务管理-账号流水' },
            },
        ]
    },
]
