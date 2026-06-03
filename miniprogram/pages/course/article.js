const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    courseId: 0,
    lessonId: 0,
    course: null,
    currentLesson: null,
    content: '',
    notes: [],
    showNotePopup: false,
    noteContent: '',
    highlightText: '',
    selectionStart: 0,
    selectionEnd: 0,
  },

  onLoad(options) {
    this.setData({ courseId: options.courseId, lessonId: parseInt(options.lessonId) })
    this.loadCourse()
    this.loadNotes()
  },

  async loadCourse() {
    const course = await api.get(`/home/courses/${this.data.courseId}`)
    let currentLesson = null
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === this.data.lessonId) {
          currentLesson = lesson
          break
        }
      }
      if (currentLesson) break
    }
    this.setData({ course, currentLesson })
    this.updateProgress()
  },

  async updateProgress() {
    if (!app.checkLogin()) return
    try {
      await api.post('/user/progress', { courseId: parseInt(this.data.courseId), lessonId: this.data.lessonId })
    } catch (e) {}
  },

  async loadNotes() {
    if (!app.checkLogin()) return
    try {
      const notes = await api.get('/user/notes')
      const filtered = notes.filter(n => n.courseId === parseInt(this.data.courseId) && n.lessonId === this.data.lessonId)
      this.setData({ notes: filtered })
    } catch (e) {}
  },

  onTextLongPress(e) {
    this.setData({
      showNotePopup: true,
      highlightText: e.detail.content || '',
      noteContent: '',
    })
  },

  onNoteInputChange(e) {
    this.setData({ noteContent: e.detail.value })
  },

  async onSaveNote() {
    if (!app.requireLogin()) return
    if (!this.data.noteContent.trim()) {
      wx.showToast({ title: '请输入笔记内容', icon: 'none' })
      return
    }
    try {
      await api.post('/user/notes', {
        courseId: parseInt(this.data.courseId),
        lessonId: this.data.lessonId,
        content: this.data.noteContent,
        highlight: this.data.highlightText,
      })
      wx.showToast({ title: '笔记已保存', icon: 'success' })
      this.setData({ showNotePopup: false, noteContent: '', highlightText: '' })
      this.loadNotes()
    } catch (e) {}
  },

  onCloseNotePopup() {
    this.setData({ showNotePopup: false })
  },

  onLessonTap(e) {
    const lessonId = e.currentTarget.dataset.id
    this.setData({ lessonId })
    this.loadCourse()
    this.loadNotes()
  },
})
