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
import { getMenuList } from '@/utils/auth';

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/home',
      meta: { code: '1000', name: '首页' },
      component: () => import('@/views/home/Home'),
      children: [
        {
          path: '/',
          meta: { code: '1000', name: '首页' },
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
    
    {
      path: '/login', component: () => import('@/views/login/login'),
      meta: { white: true }
    },
    
    // 销售人员跳转登陆
    {
      path: '/tokenLogin', component: () => import('@/views/login/login'),
      meta: { white: true }
    },
    
    // 审核人员跳转登录
    {
      path: '/auditorLogin', component: () => import('@/views/login/login'),
      meta: { white: true }
    },
    
    // 广告主邮件确认支付回调
    {
      path: '/mailPayCallBack', component: () => import('@/views/mailCallback/MailCallback'),
      meta: { white: true }
    },
    
    {path: '/404', component: () => import('@/views/errorPage/404'), meta: {white: true}},
    
    {path: '/', redirect: '/login', hidden: true, meta: {white: true}},
    
    {path: '*', redirect: '/404', hidden: true, meta: {white: true}}
  ]
})
Vue.use(Router)
// 进度条
NProgress.inc(0.8)
NProgress.configure({easing: 'ease', speed: 1500, showSpinner: false})

router.beforeEach((to, from, next) => {
  NProgress.start();
  let menuList = getMenuList();
  let canEnter = false;
  if (menuList) {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].code === to.meta.code && menuList[i].selected) {
        canEnter = true;
      }
    }
  }
  
  // 判断该路由是否需要登录权限
  if (store.state.token.userToken && canEnter) { // 通过vuex state获取当前登录状态
    next()
  } else {
    if (to.meta.white) {
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
