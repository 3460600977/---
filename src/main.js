// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.css'; // element主题重置生成文件,勿手动修改,在element-variables中修改
import '@/assets/styles/index.scss';
import api from '@/api/index'
import tools from '@/utils/tools'
import store from '@/store'
import noData from './components/noData'

import * as filters from './filters/index' // global filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI);

Vue.config.productionTip = false

//解决IE Failed to resolve async component default: ReferenceError: “Promise”未定义
// require('es6-promise').polyfill();
// require('es6-promise/auto');

Vue.prototype.$api = api;
Vue.prototype.$tools = tools;
Vue.component('noData', noData )
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
