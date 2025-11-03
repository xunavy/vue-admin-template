import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'
import { validateToken, refreshAccessToken } from '@/utils/security'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 防止SQL注入的函数
const preventSQLInjection = (value) => {
  if (typeof value === 'string') {
    // 移除危险的SQL关键词
    return value.replace(/('|"|;|--|\/\*|\*\/|xp_cmdshell|exec|select|insert|update|delete|drop|alter|create|union|join|where|and|or|not|like|in|between|order|by|group|having|limit|offset|fetch|into|outfile|load_file|dumpfile|concat|char|hex|unhex|cast|convert|declare|set|exec|execute|xp_)/gi, '')
  }
  return value
}

// 防止XSS攻击的函数
const preventXSS = (value) => {
  if (typeof value === 'string') {
    // 转义HTML特殊字符
    return value.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  return value
}

// 递归过滤请求数据
const filterRequestData = (data) => {
  if (typeof data === 'object' && data !== null) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = filterRequestData(data[key])
      }
    }
  } else if (typeof data === 'string') {
    data = preventSQLInjection(data)
    data = preventXSS(data)
  }
  return data
}

// request interceptor
service.interceptors.request.use(
  async config => {
    // do something before request is sent
    
    // 过滤请求数据，防止SQL注入和XSS攻击
    if (config.data) {
      config.data = filterRequestData(config.data)
    }
    if (config.params) {
      config.params = filterRequestData(config.params)
    }
    
    // 添加CSRF令牌
    config.headers['X-CSRF-Token'] = store.getters.csrfToken || ''
    
    // 检查token是否有效
    const token = getToken()
    if (token) {
      if (!validateToken(token)) {
        // token过期，尝试刷新
        const newToken = await refreshAccessToken()
        if (newToken) {
          config.headers['X-Token'] = newToken
        } else {
          // 刷新失败，跳转到登录页
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
          return Promise.reject(new Error('Token expired'))
        }
      } else {
        config.headers['X-Token'] = token
      }
    }
    
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    
    // 保存CSRF令牌
    if (response.headers['x-csrf-token']) {
      store.commit('SET_CSRF_TOKEN', response.headers['x-csrf-token'])
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
