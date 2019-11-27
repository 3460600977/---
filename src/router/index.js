import Vue from 'vue'
import Router from 'vue-router'
import {putManageRouter} from './modules/putManage' // 投放管理

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/home',
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
      path: '/login',
      component: () => import('@/views/login/login')
    },
    {
      path: '/404',
      component: () => import('@/views/errorPage/404')
    },
    { path: '/', redirect: '/home', hidden: true },
    { path: '*', redirect: '/404', hidden: true }
  ]
})
