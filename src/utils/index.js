import axios from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'

const http = axios.create({
  // baseURL: '/',
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',

  },
  timeout: 5000 * 60 // 5分钟超时时间
})

http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  // error => {
  //   console.error('请求错误:', error)
  //   return Promise.reject(error)
  // }
)

http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      if (error.response.data.message === "未提供认证 token" || error.response.data.message === '无效的token') {
        ElMessage.error('认证已过期或无效，请重新登录，页面将跳转至登录页')
        localStorage.removeItem('token')
        document.documentElement.style.transition = 'opacity 0.5s ease-in-out'
        document.documentElement.style.opacity = '0.4'
        
        setTimeout(() => {
            router.push('/')
            document.documentElement.style.opacity = '1'
        }, 600)
        return new Promise(() => { }) // 关键：中断 Promise，不抛出错误
      }
      if (error.response.status === 302) {
        return error.response.data
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
    } else {
      console.error('请求配置错误:', error.message)
    }
    return Promise.resolve(error.response.data)
  }
)

export default http
