const express = require('express')
const router = express.Router()
const data = require('../mock/data')

router.get('/banners', (req, res) => {
  res.json({ code: 0, data: data.banners })
})

router.get('/categories', (req, res) => {
  res.json({ code: 0, data: data.categories })
})

router.get('/courses/hot', (req, res) => {
  const hot = data.courses.filter(c => c.isHot)
  res.json({ code: 0, data: hot })
})

router.get('/courses/new', (req, res) => {
  const newCourses = data.courses.filter(c => c.isNew)
  res.json({ code: 0, data: newCourses })
})

router.get('/courses/seckill', (req, res) => {
  res.json({ code: 0, data: data.seckillCourses })
})

router.get('/courses/group', (req, res) => {
  res.json({ code: 0, data: data.groupBuys })
})

router.get('/courses', (req, res) => {
  const { categoryType, keyword, page = 1, pageSize = 10 } = req.query
  let result = [...data.courses]
  if (categoryType) {
    result = result.filter(c => c.categoryType === categoryType)
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(c =>
      c.title.toLowerCase().includes(kw) ||
      c.teacherName.toLowerCase().includes(kw) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(kw)))
    )
  }
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  res.json({
    code: 0,
    data: {
      list: result.slice(start, end),
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }
  })
})

router.get('/courses/:id', (req, res) => {
  const course = data.courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.json({ code: -1, msg: '课程不存在' })
  const teacher = data.teachers.find(t => t.id === course.teacherId)
  const courseReviews = data.reviews.filter(r => r.courseId === course.id)
  res.json({ code: 0, data: { ...course, teacher, reviews: courseReviews } })
})

router.get('/teachers', (req, res) => {
  res.json({ code: 0, data: data.teachers })
})

router.get('/teachers/:id', (req, res) => {
  const teacher = data.teachers.find(t => t.id === parseInt(req.params.id))
  if (!teacher) return res.json({ code: -1, msg: '讲师不存在' })
  const teacherCourses = data.courses.filter(c => c.teacherId === teacher.id)
  res.json({ code: 0, data: { ...teacher, courses: teacherCourses } })
})

router.get('/reviews', (req, res) => {
  const { courseId } = req.query
  let result = [...data.reviews]
  if (courseId) result = result.filter(r => r.courseId === parseInt(courseId))
  res.json({ code: 0, data: result })
})

module.exports = router
