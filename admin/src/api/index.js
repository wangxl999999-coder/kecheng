import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(res => res.data, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('adminToken')
    location.href = '/login'
  }
  ElMessage.error(err.response?.data?.message || err.message || '请求失败')
  return Promise.reject(err)
})

export default request
