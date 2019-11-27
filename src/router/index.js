import Vue from 'vue'
import Router from 'vue-router'
import {putManageRouter} from './modules/putManage' // 投放管理

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('@/views/home/Home'),
      children: [
        {
          path: '/',
          component: () => import ('@/views/home/modules/homeBody'),
        },
        ...putManageRouter,
      ],
    },
    {
      path: '/404',
      component: () => import('@/views/errorPage/404')
    },
    { path: '*', redirect: '/404', hidden: true }
  ]
})
