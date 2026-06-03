const express = require('express')
const router = express.Router()
const data = require('../mock/data')
const jwt = require('jsonwebtoken')
const SECRET = 'zhiqu_kecheng_secret'

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.json({ code: -1, msg: '请先登录' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.json({ code: -1, msg: '登录已过期' })
  }
}

router.post('/login', (req, res) => {
  const { phone, code } = req.body
  if (!phone || !code) return res.json({ code: -1, msg: '手机号和验证码不能为空' })
  if (code !== '123456') return res.json({ code: -1, msg: '验证码错误' })
  let user = data.users.find(u => u.phone === phone)
  if (!user) {
    user = { id: data.users.length + 1, phone, nickname: '新用户', avatar: '', balance: 0, createdAt: new Date().toISOString().slice(0, 10) }
    data.users.push(user)
  }
  const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '7d' })
  res.json({ code: 0, data: { token, userInfo: user } })
})

router.post('/sendCode', (req, res) => {
  const { phone } = req.body
  if (!phone) return res.json({ code: -1, msg: '手机号不能为空' })
  res.json({ code: 0, data: { msg: '验证码发送成功(测试验证码:123456)' } })
})

router.get('/info', auth, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id)
  if (!user) return res.json({ code: -1, msg: '用户不存在' })
  res.json({ code: 0, data: user })
})

router.put('/info', auth, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id)
  if (!user) return res.json({ code: -1, msg: '用户不存在' })
  Object.assign(user, req.body)
  res.json({ code: 0, data: user })
})

router.get('/courses', auth, (req, res) => {
  const { type } = req.query
  let result = data.userCourses.filter(uc => uc.userId === req.user.id)
  if (type && type !== 'all') {
    result = result.map(uc => {
      const course = data.courses.find(c => c.id === uc.courseId)
      return { ...uc, course }
    }).filter(item => item.course && item.course.categoryType === type)
  } else {
    result = result.map(uc => {
      const course = data.courses.find(c => c.id === uc.courseId)
      return { ...uc, course }
    })
  }
  res.json({ code: 0, data: result })
})

router.get('/favorites', auth, (req, res) => {
  const result = data.favorites.filter(f => f.userId === req.user.id).map(f => {
    const course = data.courses.find(c => c.id === f.courseId)
    return { ...f, course }
  })
  res.json({ code: 0, data: result })
})

router.post('/favorites', auth, (req, res) => {
  const courseId = parseInt(req.body.courseId)
  const exist = data.favorites.find(f => f.userId === req.user.id && f.courseId === courseId)
  if (exist) {
    data.favorites.splice(data.favorites.indexOf(exist), 1)
    res.json({ code: 0, data: { favorited: false } })
  } else {
    data.favorites.push({ id: data.favorites.length + 1, userId: req.user.id, courseId, createdAt: new Date().toISOString().slice(0, 10) })
    res.json({ code: 0, data: { favorited: true } })
  }
})

router.get('/notes', auth, (req, res) => {
  const result = data.notes.filter(n => n.userId === req.user.id).map(n => {
    const course = data.courses.find(c => c.id === n.courseId)
    return { ...n, courseTitle: course ? course.title : '' }
  })
  res.json({ code: 0, data: result })
})

router.post('/notes', auth, (req, res) => {
  const { courseId, lessonId, content, highlight } = req.body
  const note = { id: data.notes.length + 1, userId: req.user.id, courseId, lessonId, content, highlight, createdAt: new Date().toISOString() }
  data.notes.push(note)
  res.json({ code: 0, data: note })
})

router.get('/coupons', auth, (req, res) => {
  res.json({ code: 0, data: data.coupons.filter(c => c.status === 1) })
})

router.post('/coupons/receive', auth, (req, res) => {
  const { couponId } = req.body
  const coupon = data.coupons.find(c => c.id === couponId)
  if (!coupon) return res.json({ code: -1, msg: '优惠券不存在' })
  if (coupon.usedCount >= coupon.totalCount) return res.json({ code: -1, msg: '优惠券已领完' })
  coupon.usedCount++
  res.json({ code: 0, data: { msg: '领取成功' } })
})

router.get('/orders', auth, (req, res) => {
  const result = data.orders.filter(o => o.userId === req.user.id)
  res.json({ code: 0, data: result })
})

router.post('/orders', auth, (req, res) => {
  const { courseId, type, couponId } = req.body
  const course = data.courses.find(c => c.id === courseId)
  if (!course) return res.json({ code: -1, msg: '课程不存在' })
  let amount = type === 'group' ? course.groupPrice : course.price
  if (couponId) {
    const coupon = data.coupons.find(c => c.id === couponId)
    if (coupon && coupon.type === 'cash') amount = Math.max(0, amount - coupon.value)
    if (coupon && coupon.type === 'discount') amount = Math.round(amount * coupon.value / 100 * 100) / 100
  }
  const order = {
    id: 'ORD' + Date.now(),
    userId: req.user.id, courseId, courseTitle: course.title,
    amount, payMethod: 'wechat', status: 'paid', type,
    createdAt: new Date().toISOString()
  }
  data.orders.push(order)
  data.userCourses.push({
    id: data.userCourses.length + 1, userId: req.user.id, courseId,
    progress: 0, learnedLessons: [], lastLearnTime: new Date().toISOString()
  })
  res.json({ code: 0, data: order })
})

router.get('/messages', auth, (req, res) => {
  const result = data.messages.filter(m => m.userId === req.user.id)
  res.json({ code: 0, data: result })
})

router.post('/messages/read', auth, (req, res) => {
  const { id } = req.body
  const msg = data.messages.find(m => m.id === id && m.userId === req.user.id)
  if (msg) msg.isRead = true
  res.json({ code: 0, data: { msg: '已读' } })
})

router.get('/progress', auth, (req, res) => {
  const { courseId } = req.query
  const progress = data.userCourses.find(uc => uc.userId === req.user.id && uc.courseId === parseInt(courseId))
  if (!progress) return res.json({ code: -1, msg: '未购买该课程' })
  const course = data.courses.find(c => c.id === progress.courseId)
  const totalLessons = course ? course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0) : 0
  res.json({ code: 0, data: { ...progress, totalLessons, learnedCount: progress.learnedLessons.length, remainingCount: totalLessons - progress.learnedLessons.length } })
})

router.post('/progress', auth, (req, res) => {
  const { courseId, lessonId } = req.body
  const progress = data.userCourses.find(uc => uc.userId === req.user.id && uc.courseId === courseId)
  if (!progress) return res.json({ code: -1, msg: '未购买该课程' })
  if (!progress.learnedLessons.includes(lessonId)) {
    progress.learnedLessons.push(lessonId)
  }
  const course = data.courses.find(c => c.id === courseId)
  const totalLessons = course ? course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0) : 0
  progress.progress = Math.round(progress.learnedLessons.length / totalLessons * 100)
  progress.lastLearnTime = new Date().toISOString()
  res.json({ code: 0, data: progress })
})

router.post('/distribution/poster', auth, (req, res) => {
  const { courseId } = req.body
  const user = data.users.find(u => u.id === req.user.id)
  const course = data.courses.find(c => c.id === courseId)
  res.json({
    code: 0,
    data: {
      posterUrl: `https://example.com/poster/${courseId}_${req.user.id}.png`,
      shareTitle: `${user.nickname}推荐：「${course ? course.title : ''}」`,
      shareDesc: course ? course.description : '',
    }
  })
})

module.exports = router
