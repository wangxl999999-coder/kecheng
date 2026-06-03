const express = require('express')
const router = express.Router()
const data = require('../mock/data')

router.get('/list', (req, res) => {
  const { page = 1, pageSize = 10, keyword, status } = req.query
  let result = [...data.users]
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(u => u.nickname.toLowerCase().includes(kw) || u.phone.includes(kw))
  }
  if (status) result = result.filter(u => u.status === parseInt(status))
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({ code: 0, data: { list: result.slice(start, end), total: result.length } })
})

router.put('/status', (req, res) => {
  const { id, status } = req.body
  const user = data.users.find(u => u.id === id)
  if (!user) return res.json({ code: -1, msg: '用户不存在' })
  user.status = status
  res.json({ code: 0, data: { msg: '操作成功' } })
})

router.get('/courses', (req, res) => {
  const { page = 1, pageSize = 10, keyword, categoryType, status } = req.query
  let result = [...data.courses]
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(c => c.title.toLowerCase().includes(kw) || c.teacherName.toLowerCase().includes(kw))
  }
  if (categoryType) result = result.filter(c => c.categoryType === categoryType)
  if (status !== undefined) result = result.filter(c => c.status === parseInt(status))
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({ code: 0, data: { list: result.slice(start, end), total: result.length } })
})

router.post('/courses', (req, res) => {
  const course = { id: data.courses.length + 1, ...req.body, buyCount: 0, rating: 0, ratingCount: 0, isHot: false, isNew: true }
  data.courses.push(course)
  res.json({ code: 0, data: course })
})

router.put('/courses/:id', (req, res) => {
  const course = data.courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.json({ code: -1, msg: '课程不存在' })
  Object.assign(course, req.body)
  res.json({ code: 0, data: course })
})

router.delete('/courses/:id', (req, res) => {
  const idx = data.courses.findIndex(c => c.id === parseInt(req.params.id))
  if (idx === -1) return res.json({ code: -1, msg: '课程不存在' })
  data.courses.splice(idx, 1)
  res.json({ code: 0, data: { msg: '删除成功' } })
})

router.get('/coupons', (req, res) => {
  const { page = 1, pageSize = 10, status } = req.query
  let result = [...data.coupons]
  if (status !== undefined) result = result.filter(c => c.status === parseInt(status))
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({ code: 0, data: { list: result.slice(start, end), total: result.length } })
})

router.post('/coupons', (req, res) => {
  const coupon = { id: data.coupons.length + 1, ...req.body, usedCount: 0 }
  data.coupons.push(coupon)
  res.json({ code: 0, data: coupon })
})

router.put('/coupons/:id', (req, res) => {
  const coupon = data.coupons.find(c => c.id === parseInt(req.params.id))
  if (!coupon) return res.json({ code: -1, msg: '优惠券不存在' })
  Object.assign(coupon, req.body)
  res.json({ code: 0, data: coupon })
})

router.delete('/coupons/:id', (req, res) => {
  const idx = data.coupons.findIndex(c => c.id === parseInt(req.params.id))
  if (idx === -1) return res.json({ code: -1, msg: '优惠券不存在' })
  data.coupons.splice(idx, 1)
  res.json({ code: 0, data: { msg: '删除成功' } })
})

router.get('/seckills', (req, res) => {
  const { page = 1, pageSize = 10, status } = req.query
  let result = [...data.seckillCourses]
  if (status !== undefined) result = result.filter(s => s.status === parseInt(status))
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({ code: 0, data: { list: result.slice(start, end), total: result.length } })
})

router.post('/seckills', (req, res) => {
  const seckill = { id: data.seckillCourses.length + 1, ...req.body, soldCount: 0 }
  data.seckillCourses.push(seckill)
  res.json({ code: 0, data: seckill })
})

router.put('/seckills/:id', (req, res) => {
  const seckill = data.seckillCourses.find(s => s.id === parseInt(req.params.id))
  if (!seckill) return res.json({ code: -1, msg: '秒杀活动不存在' })
  Object.assign(seckill, req.body)
  res.json({ code: 0, data: seckill })
})

router.delete('/seckills/:id', (req, res) => {
  const idx = data.seckillCourses.findIndex(s => s.id === parseInt(req.params.id))
  if (idx === -1) return res.json({ code: -1, msg: '秒杀活动不存在' })
  data.seckillCourses.splice(idx, 1)
  res.json({ code: 0, data: { msg: '删除成功' } })
})

router.get('/banners', (req, res) => {
  res.json({ code: 0, data: data.banners })
})

router.post('/banners', (req, res) => {
  const banner = { id: data.banners.length + 1, ...req.body }
  data.banners.push(banner)
  res.json({ code: 0, data: banner })
})

router.put('/banners/:id', (req, res) => {
  const banner = data.banners.find(b => b.id === parseInt(req.params.id))
  if (!banner) return res.json({ code: -1, msg: '轮播图不存在' })
  Object.assign(banner, req.body)
  res.json({ code: 0, data: banner })
})

router.delete('/banners/:id', (req, res) => {
  const idx = data.banners.findIndex(b => b.id === parseInt(req.params.id))
  if (idx === -1) return res.json({ code: -1, msg: '轮播图不存在' })
  data.banners.splice(idx, 1)
  res.json({ code: 0, data: { msg: '删除成功' } })
})

router.get('/orders', (req, res) => {
  const { page = 1, pageSize = 10, keyword, status } = req.query
  let result = [...data.orders]
  if (keyword) result = result.filter(o => o.courseTitle.includes(keyword) || o.id.includes(keyword))
  if (status) result = result.filter(o => o.status === status)
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({ code: 0, data: { list: result.slice(start, end), total: result.length } })
})

router.get('/teachers', (req, res) => {
  res.json({ code: 0, data: data.teachers })
})

router.post('/teachers', (req, res) => {
  const teacher = { id: data.teachers.length + 1, ...req.body, fans: 0, courseCount: 0 }
  data.teachers.push(teacher)
  res.json({ code: 0, data: teacher })
})

router.put('/teachers/:id', (req, res) => {
  const teacher = data.teachers.find(t => t.id === parseInt(req.params.id))
  if (!teacher) return res.json({ code: -1, msg: '讲师不存在' })
  Object.assign(teacher, req.body)
  res.json({ code: 0, data: teacher })
})

router.delete('/teachers/:id', (req, res) => {
  const idx = data.teachers.findIndex(t => t.id === parseInt(req.params.id))
  if (idx === -1) return res.json({ code: -1, msg: '讲师不存在' })
  data.teachers.splice(idx, 1)
  res.json({ code: 0, data: { msg: '删除成功' } })
})

module.exports = router
