/**
 * 来源
 * CAS-RMS ->  beike-rms
 */
import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { removeUserInfo } from '@/utils/auth';log
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // request timeout
})
// 拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent

    if (store.state.token.userToken) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = store.state.token.userToken;
    } else {
      config.headers['token'] = '';
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，退出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data;
    // 下载 csv xls
    if (response.headers['content-type'].toLowerCase() === 'application/xls;charset=utf-8' ||
      response.headers['content-type'].toLowerCase() === 'application/vnd.ms-excel;charset=utf-8') {
      return res;
    }

    /**
     * 广告主邮件支付状态码过滤
     * 100801 支付失败
     * 100802 链接失效
     * 100803 方案已过期
     * 100804 方案已支付
     */
    if (res.code === 100801 
      || res.code === 100802 
      || res.code === 100803 
      || res.code === 100804) 
    {
      return response.data;
    }


    if (res.code !== 100001) {
      // 100900:token过期
      if (res.code === 100900 && location.hash.indexOf('/login') === -1) {
        MessageBox.confirm('身份信息失效，可以取消继续留在该页面，或者重新登录', '确定退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUserInfo()
          store.commit('setToken', '')
          window.location.href = "/login";
        })
      }
      Message({
        message: res.msg || '网络异常, 请稍后再试',
        type: 'error'
      });
      return Promise.reject(res)
    } else {
      if (response.headers.token) {
        response.data.token = response.headers.token;
      }
      return response.data.data;
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || '网络异常, 请稍后再试',
      type: 'error',
    })
    return Promise.reject(error)
  }
)

export default service
