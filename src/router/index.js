import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {putManageRouter} from './modules/putManage' // 投放管理

Vue.use(Router)

const router =  new Router({
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
    {
      path: '/themePreview',
      component: () => import('@/views/themePreview/themePreview')
    },
    { path: '/', redirect: '/home', hidden: true },
    { path: '*', redirect: '/404', hidden: true }
  ]
})


NProgress.inc(0.8)
NProgress.configure({ easing: 'ease', speed: 1500, showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start()
  next();
})

router.afterEach(() => {
  NProgress.done()
  NProgress.remove();
})


export default router;
