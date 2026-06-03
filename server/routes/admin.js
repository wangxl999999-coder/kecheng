const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const data = require('../mock/data')

const ADMIN_SECRET = 'zhiqu-admin-secret-2024'
const adminAccount = { username: 'admin', password: '123456' }

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username !== adminAccount.username || password !== adminAccount.password) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }
  const token = jwt.sign({ username, role: 'admin' }, ADMIN_SECRET, { expiresIn: '7d' })
  res.json({ token, adminInfo: { username, nickname: '管理员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' } })
})

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: '未授权' })
  try { jwt.verify(authHeader.split(' ')[1], ADMIN_SECRET); next() }
  catch (e) { res.status(401).json({ message: 'Token无效' }) }
}

router.get('/users', auth, (req, res) => {
  let result = [...data.users]
  res.json({ users: result, total: result.length })
})

router.get('/users/:id', auth, (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id))
  if (!user) return res.status(404).json({ message: '用户不存在' })
  res.json(user)
})

router.put('/users/:id', auth, (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id))
  if (!user) return res.status(404).json({ message: '用户不存在' })
  Object.assign(user, req.body)
  res.json(user)
})

router.get('/courses', auth, (req, res) => {
  let result = [...data.courses]
  res.json({ courses: result, total: result.length })
})

router.post('/courses', auth, (req, res) => {
  const course = { id: data.courses.length + 1, ...req.body, buyCount: 0, rating: 5.0, ratingCount: 0 }
  data.courses.unshift(course)
  res.json(course)
})

router.put('/courses/:id', auth, (req, res) => {
  const course = data.courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).json({ message: '课程不存在' })
  Object.assign(course, req.body)
  res.json(course)
})

router.delete('/courses/:id', auth, (req, res) => {
  const idx = data.courses.findIndex(c => c.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ message: '课程不存在' })
  data.courses.splice(idx, 1)
  res.json({ message: '删除成功' })
})

router.get('/coupons', auth, (req, res) => {
  res.json({ coupons: data.coupons, total: data.coupons.length })
})

router.post('/coupons', auth, (req, res) => {
  const coupon = { id: data.coupons.length + 1, ...req.body, usedCount: 0 }
  data.coupons.unshift(coupon)
  res.json(coupon)
})

router.put('/coupons/:id', auth, (req, res) => {
  const coupon = data.coupons.find(c => c.id === parseInt(req.params.id))
  if (!coupon) return res.status(404).json({ message: '优惠券不存在' })
  Object.assign(coupon, req.body)
  res.json(coupon)
})

router.delete('/coupons/:id', auth, (req, res) => {
  const idx = data.coupons.findIndex(c => c.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ message: '优惠券不存在' })
  data.coupons.splice(idx, 1)
  res.json({ message: '删除成功' })
})

router.get('/seckills', auth, (req, res) => {
  const list = data.seckillCourses.map(s => ({ ...s, course: data.courses.find(c => c.id === s.courseId) }))
  res.json({ seckills: list, total: list.length })
})

router.post('/seckills', auth, (req, res) => {
  const seckill = { id: data.seckillCourses.length + 1, ...req.body, soldCount: 0 }
  data.seckillCourses.unshift(seckill)
  res.json(seckill)
})

router.put('/seckills/:id', auth, (req, res) => {
  const seckill = data.seckillCourses.find(s => s.id === parseInt(req.params.id))
  if (!seckill) return res.status(404).json({ message: '秒杀活动不存在' })
  Object.assign(seckill, req.body)
  res.json(seckill)
})

router.delete('/seckills/:id', auth, (req, res) => {
  const idx = data.seckillCourses.findIndex(s => s.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ message: '秒杀活动不存在' })
  data.seckillCourses.splice(idx, 1)
  res.json({ message: '删除成功' })
})

router.get('/orders', auth, (req, res) => {
  res.json({ orders: data.orders, total: data.orders.length })
})

module.exports = router
