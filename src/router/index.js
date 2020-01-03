import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { putManageRouter } from './modules/putManage' // 投放管理
import { cityInsightRouter } from './modules/cityInsight'
import { reportCenterRouter } from './modules/reportCenter'//报表中心
import { auditManageRouter } from './modules/auditManage'//审核管理
import { toolBoxRouter } from './modules/toolBox'//工具箱
import { peopleInsightRouter } from './modules/peopleInsight' // 人群洞察
import { getUserInfo } from '@/utils/auth';

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/home',
      meta: {title: "测试"},
      component: () => import('@/views/home/Home'),
      children: [
        {
          path: '/',
          component: () => import('@/views/home/modules/HomeBody'),
        },
        ...putManageRouter,
        ...cityInsightRouter,
        ...reportCenterRouter,
        ...auditManageRouter,
        ...toolBoxRouter,
        ...peopleInsightRouter
      ],
    },
    
    {path: '/login', component: () => import('@/views/login/login')},
    
    {path: '/tokenLogin', component: () => import('@/views/login/login')},
    
    {path: '/404', component: () => import('@/views/errorPage/404')},
    
    {path: '/', redirect: '/login', hidden: true},
    
    {path: '*', redirect: '/404', hidden: true}
  ]
})
Vue.use(Router)
// 进度条
NProgress.inc(0.8)
NProgress.configure({easing: 'ease', speed: 1500, showSpinner: false})

router.beforeEach((to, from, next) => {
  NProgress.start();
  let userInfo = getUserInfo()
  let canEnter = false
  if (userInfo) {
    for (let i = 0; i < userInfo.menu.length; i++) {
      console.log(userInfo.menu[i].code === to.meta.code, userInfo.menu[i].code, to.meta.code)
      if (userInfo.menu[i].code === to.meta.code && userInfo.menu[i].selected) {
        canEnter = true
      }
    }
  }
  console.log('canEnter', canEnter,userInfo)
  // 判断该路由是否需要登录权限
  if (store.state.token.userToken) { // 通过vuex state获取当前登录状态
    next()
  } else {
    if ('/login' === to.path) {
      next()
    } else {
      NProgress.done()
      NProgress.remove()
      next(
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
        {path: '/login', query: {}}
      )
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  NProgress.remove()
})


export default router;
