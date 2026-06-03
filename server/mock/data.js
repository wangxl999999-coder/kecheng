const banners = [
  { id: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20course%20banner%20education%20learning%20platform%20modern%20clean&image_size=landscape_16_9', link: '/pages/course/detail?id=1', title: '热门课程推荐' },
  { id: 2, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=live%20streaming%20education%20webinar%20banner&image_size=landscape_16_9', link: '/pages/course/detail?id=5', title: '直播公开课' },
  { id: 3, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flash%20sale%20discount%20education%20courses&image_size=landscape_16_9', link: '/pages/market/seckill', title: '限时秒杀' },
]

const categories = [
  { id: 1, name: '音频课', icon: '🎵', type: 'audio' },
  { id: 2, name: '视频课', icon: '🎬', type: 'video' },
  { id: 3, name: '图文专栏', icon: '📖', type: 'article' },
  { id: 4, name: '直播课', icon: '📡', type: 'live' },
  { id: 5, name: '训练营', icon: '🏋️', type: 'camp' },
]

const teachers = [
  { id: 1, name: '张教授', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20teacher%20avatar%20portrait&image_size=square_hd', title: '资深产品专家', desc: '10年互联网产品经验，曾任BAT高级产品总监', fans: 12800, courseCount: 12 },
  { id: 2, name: '李老师', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20teacher%20avatar%20portrait&image_size=square_hd', title: '数据分析专家', desc: '清华大学博士，数据科学领域权威', fans: 9600, courseCount: 8 },
  { id: 3, name: '王导师', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20instructor%20avatar%20portrait&image_size=square_hd', title: '技术架构师', desc: '全栈工程师，精通前后端技术', fans: 15200, courseCount: 15 },
  { id: 4, name: '陈教练', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20coach%20avatar%20portrait&image_size=square_hd', title: '职业规划师', desc: '帮助10000+学员实现职业突破', fans: 7800, courseCount: 6 },
]

const courses = [
  {
    id: 1, title: '产品经理从入门到精通', categoryId: 2, categoryType: 'video',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20manager%20course%20cover%20modern%20design&image_size=landscape_16_9',
    teacherId: 1, teacherName: '张教授',
    price: 199, originalPrice: 399, groupPrice: 149,
    buyCount: 3256, rating: 4.9, ratingCount: 856,
    description: '系统学习产品经理核心技能，从需求分析到产品上线全流程',
    detail: '<p>本课程涵盖产品经理完整知识体系：</p><p>1. 产品思维培养</p><p>2. 需求分析方法论</p><p>3. 竞品分析实战</p><p>4. 原型设计与PRD撰写</p><p>5. 项目管理与上线</p><p>6. 数据分析与迭代</p>',
    chapters: [
      { id: 1, title: '产品思维入门', lessons: [
        { id: 1, title: '什么是产品思维', duration: '15:30', type: 'video', url: '', free: true },
        { id: 2, title: '用户需求洞察', duration: '22:10', type: 'video', url: '', free: true },
        { id: 3, title: '产品价值公式', duration: '18:45', type: 'video', url: '', free: false },
      ]},
      { id: 2, title: '需求分析实战', lessons: [
        { id: 4, title: '需求收集方法', duration: '25:00', type: 'video', url: '', free: false },
        { id: 5, title: '需求优先级排序', duration: '20:30', type: 'video', url: '', free: false },
        { id: 6, title: '需求文档撰写', duration: '30:15', type: 'video', url: '', free: false },
      ]},
      { id: 3, title: '竞品分析', lessons: [
        { id: 7, title: '竞品选择策略', duration: '16:20', type: 'video', url: '', free: false },
        { id: 8, title: '竞品分析框架', duration: '28:40', type: 'video', url: '', free: false },
      ]},
    ],
    isHot: true, isNew: false, isSeckill: false, isGroup: true,
    tags: ['产品经理', '需求分析', '入门'],
    updatedAt: '2026-05-20',
  },
  {
    id: 2, title: 'Python数据分析实战', categoryId: 2, categoryType: 'video',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
    teacherId: 2, teacherName: '李老师',
    price: 299, originalPrice: 599, groupPrice: 229,
    buyCount: 5120, rating: 4.8, ratingCount: 1230,
    description: '从零开始学习Python数据分析，掌握Pandas、NumPy、Matplotlib',
    detail: '<p>全面掌握Python数据分析技能</p>',
    chapters: [
      { id: 1, title: 'Python基础', lessons: [
        { id: 1, title: '环境搭建', duration: '10:00', type: 'video', url: '', free: true },
        { id: 2, title: '基础语法', duration: '35:20', type: 'video', url: '', free: true },
        { id: 3, title: '数据结构', duration: '28:10', type: 'video', url: '', free: false },
      ]},
      { id: 2, title: 'Pandas入门', lessons: [
        { id: 4, title: 'Series与DataFrame', duration: '22:30', type: 'video', url: '', free: false },
        { id: 5, title: '数据清洗', duration: '30:00', type: 'video', url: '', free: false },
      ]},
    ],
    isHot: true, isNew: false, isSeckill: false, isGroup: true,
    tags: ['Python', '数据分析', 'Pandas'],
    updatedAt: '2026-05-18',
  },
  {
    id: 3, title: '每天10分钟·提升表达力', categoryId: 1, categoryType: 'audio',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=communication%20skills%20audio%20course%20cover&image_size=landscape_16_9',
    teacherId: 4, teacherName: '陈教练',
    price: 69, originalPrice: 129, groupPrice: 49,
    buyCount: 8900, rating: 4.7, ratingCount: 2100,
    description: '每天10分钟，30天全面提升你的表达力和沟通技巧',
    detail: '<p>音频课程，随时随地学习</p>',
    chapters: [
      { id: 1, title: '基础表达', lessons: [
        { id: 1, title: '克服紧张情绪', duration: '08:30', type: 'audio', url: '', free: true },
        { id: 2, title: '逻辑表达法', duration: '10:15', type: 'audio', url: '', free: true },
        { id: 3, title: '故事化表达', duration: '09:45', type: 'audio', url: '', free: false },
      ]},
      { id: 2, title: '进阶技巧', lessons: [
        { id: 4, title: '即兴演讲', duration: '11:20', type: 'audio', url: '', free: false },
        { id: 5, title: '提问的艺术', duration: '09:10', type: 'audio', url: '', free: false },
      ]},
    ],
    isHot: true, isNew: false, isSeckill: false, isGroup: true,
    tags: ['表达力', '沟通', '音频'],
    updatedAt: '2026-04-10',
  },
  {
    id: 4, title: '前端架构设计指南', categoryId: 3, categoryType: 'article',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=frontend%20architecture%20design%20article%20cover&image_size=landscape_16_9',
    teacherId: 3, teacherName: '王导师',
    price: 159, originalPrice: 299, groupPrice: 119,
    buyCount: 2300, rating: 4.9, ratingCount: 560,
    description: '深度解析前端架构设计，从组件化到微前端',
    detail: '<p>图文专栏，持续更新中</p>',
    chapters: [
      { id: 1, title: '架构基础', lessons: [
        { id: 1, title: '什么是前端架构', duration: '', type: 'article', url: '', free: true, content: '<p>前端架构是指...</p>' },
        { id: 2, title: '架构设计原则', duration: '', type: 'article', url: '', free: false, content: '<p>设计原则包括...</p>' },
      ]},
    ],
    isHot: false, isNew: true, isSeckill: false, isGroup: false,
    tags: ['前端', '架构', '专栏'],
    updatedAt: '2026-05-25',
  },
  {
    id: 5, title: 'AI大模型应用开发直播课', categoryId: 4, categoryType: 'live',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20large%20model%20live%20course%20cover&image_size=landscape_16_9',
    teacherId: 3, teacherName: '王导师',
    price: 99, originalPrice: 199, groupPrice: 79,
    buyCount: 4500, rating: 4.8, ratingCount: 890,
    description: '直播学习AI大模型开发，实战项目驱动',
    detail: '<p>直播课程，每周三、五晚8点开播</p>',
    chapters: [],
    liveInfo: {
      startTime: '2026-06-05 20:00:00',
      endTime: '2026-06-05 22:00:00',
      status: 'upcoming',
      hasReplay: false,
      replayUrl: '',
    },
    isHot: true, isNew: true, isSeckill: false, isGroup: true,
    tags: ['AI', '大模型', '直播'],
    updatedAt: '2026-06-01',
  },
  {
    id: 6, title: '30天产品训练营', categoryId: 5, categoryType: 'camp',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20training%20camp%20course%20cover&image_size=landscape_16_9',
    teacherId: 1, teacherName: '张教授',
    price: 999, originalPrice: 1999, groupPrice: 799,
    buyCount: 1200, rating: 4.9, ratingCount: 320,
    description: '30天系统训练，带你从零成为合格产品经理',
    detail: '<p>训练营课程，含作业批改和1对1辅导</p>',
    chapters: [
      { id: 1, title: '第一周：产品思维', lessons: [
        { id: 1, title: '开营仪式', duration: '45:00', type: 'video', url: '', free: false },
        { id: 2, title: '产品思维训练', duration: '30:00', type: 'video', url: '', free: false },
      ]},
    ],
    isHot: true, isNew: false, isSeckill: false, isGroup: true,
    tags: ['训练营', '产品经理', '系统学习'],
    updatedAt: '2026-05-15',
  },
  {
    id: 7, title: 'React18+TypeScript企业级实战', categoryId: 2, categoryType: 'video',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=react%20typescript%20enterprise%20course%20cover&image_size=landscape_16_9',
    teacherId: 3, teacherName: '王导师',
    price: 349, originalPrice: 699, groupPrice: 269,
    buyCount: 6780, rating: 4.9, ratingCount: 1890,
    description: '从零到一搭建企业级React项目，掌握TypeScript最佳实践',
    detail: '<p>React18+TS企业级实战</p>',
    chapters: [
      { id: 1, title: '项目初始化', lessons: [
        { id: 1, title: 'Vite+React+TS搭建', duration: '20:00', type: 'video', url: '', free: true },
        { id: 2, title: 'ESLint与Prettier配置', duration: '15:30', type: 'video', url: '', free: true },
      ]},
    ],
    isHot: true, isNew: true, isSeckill: false, isGroup: true,
    tags: ['React', 'TypeScript', '前端'],
    updatedAt: '2026-05-28',
  },
  {
    id: 8, title: '职场高情商沟通术', categoryId: 1, categoryType: 'audio',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=emotional%20intelligence%20communication%20audio%20course&image_size=landscape_16_9',
    teacherId: 4, teacherName: '陈教练',
    price: 49, originalPrice: 99, groupPrice: 39,
    buyCount: 12300, rating: 4.6, ratingCount: 3400,
    description: '高情商沟通，让你在职场如鱼得水',
    detail: '<p>音频课程，通勤路上就能学</p>',
    chapters: [
      { id: 1, title: '情商基础', lessons: [
        { id: 1, title: '认识情商', duration: '08:00', type: 'audio', url: '', free: true },
        { id: 2, title: '自我觉察', duration: '10:30', type: 'audio', url: '', free: false },
      ]},
    ],
    isHot: true, isNew: false, isSeckill: true, isGroup: true,
    tags: ['情商', '沟通', '职场'],
    updatedAt: '2026-05-10',
  },
]

const reviews = [
  { id: 1, courseId: 1, userId: 1, userName: '小明', avatar: '', rating: 5, content: '非常实用的课程，学到了很多产品方法论！', time: '2026-05-20' },
  { id: 2, courseId: 1, userId: 2, userName: '小红', avatar: '', rating: 5, content: '张教授讲得很透彻，案例丰富，推荐！', time: '2026-05-18' },
  { id: 3, courseId: 1, userId: 3, userName: '小刚', avatar: '', rating: 4, content: '内容不错，就是节奏稍快，需要反复看', time: '2026-05-15' },
  { id: 4, courseId: 2, userId: 4, userName: '小李', avatar: '', rating: 5, content: 'Python入门首选课程！', time: '2026-05-22' },
  { id: 5, courseId: 2, userId: 5, userName: '小华', avatar: '', rating: 4, content: '数据分析讲得很详细', time: '2026-05-19' },
  { id: 6, courseId: 3, userId: 6, userName: '小丽', avatar: '', rating: 5, content: '每天10分钟，一个月下来真的有提升', time: '2026-05-10' },
]

const coupons = [
  { id: 1, name: '新人专享券', type: 'cash', value: 30, minSpend: 99, desc: '满99减30', startTime: '2026-01-01', endTime: '2026-12-31', status: 1, totalCount: 1000, usedCount: 356, scope: 'all' },
  { id: 2, name: '课程优惠券', type: 'cash', value: 50, minSpend: 199, desc: '满199减50', startTime: '2026-06-01', endTime: '2026-06-30', status: 1, totalCount: 500, usedCount: 120, scope: 'video' },
  { id: 3, name: '折扣券', type: 'discount', value: 80, minSpend: 0, desc: '全场8折', startTime: '2026-06-01', endTime: '2026-06-15', status: 1, totalCount: 200, usedCount: 89, scope: 'all' },
  { id: 4, name: '秒杀专享券', type: 'cash', value: 20, minSpend: 50, desc: '满50减20', startTime: '2026-06-03', endTime: '2026-06-05', status: 1, totalCount: 100, usedCount: 45, scope: 'seckill' },
]

const seckillCourses = [
  {
    id: 1, courseId: 8, title: '职场高情商沟通术',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=emotional%20intelligence%20communication%20audio%20course&image_size=landscape_16_9',
    seckillPrice: 9.9, originalPrice: 99,
    startTime: '2026-06-03 10:00:00', endTime: '2026-06-03 12:00:00',
    totalCount: 100, soldCount: 67, status: 1,
  },
  {
    id: 2, courseId: 3, title: '每天10分钟·提升表达力',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=communication%20skills%20audio%20course%20cover&image_size=landscape_16_9',
    seckillPrice: 19.9, originalPrice: 129,
    startTime: '2026-06-03 14:00:00', endTime: '2026-06-03 16:00:00',
    totalCount: 200, soldCount: 134, status: 1,
  },
]

const groupBuys = [
  { id: 1, courseId: 1, title: '产品经理从入门到精通', price: 149, originalPrice: 399, groupCount: 3, groupTime: 24, joinedCount: 56 },
  { id: 2, courseId: 2, title: 'Python数据分析实战', price: 229, originalPrice: 599, groupCount: 2, groupTime: 48, joinedCount: 89 },
  { id: 3, courseId: 5, title: 'AI大模型应用开发直播课', price: 79, originalPrice: 199, groupCount: 3, groupTime: 24, joinedCount: 123 },
]

const orders = [
  { id: 'ORD20260601001', userId: 1, courseId: 1, courseTitle: '产品经理从入门到精通', amount: 199, payMethod: 'wechat', status: 'paid', type: 'single', createdAt: '2026-06-01 10:30:00' },
  { id: 'ORD20260602001', userId: 1, courseId: 3, courseTitle: '每天10分钟·提升表达力', amount: 49, payMethod: 'wechat', status: 'paid', type: 'group', createdAt: '2026-06-02 14:20:00' },
  { id: 'ORD20260602002', userId: 1, courseId: 5, courseTitle: 'AI大模型应用开发直播课', amount: 79, payMethod: 'wechat', status: 'paid', type: 'group', createdAt: '2026-06-02 16:45:00' },
]

const userCourses = [
  { id: 1, userId: 1, courseId: 1, progress: 45, learnedLessons: [1, 2, 4], lastLearnTime: '2026-06-02 20:30:00' },
  { id: 2, userId: 1, courseId: 3, progress: 60, learnedLessons: [1, 2, 3, 4], lastLearnTime: '2026-06-03 08:15:00' },
  { id: 3, userId: 1, courseId: 5, progress: 0, learnedLessons: [], lastLearnTime: '' },
]

const favorites = [
  { id: 1, userId: 1, courseId: 2, createdAt: '2026-05-28' },
  { id: 2, userId: 1, courseId: 7, createdAt: '2026-05-30' },
]

const notes = [
  { id: 1, userId: 1, courseId: 1, lessonId: 1, content: '产品思维的核心是以用户为中心', highlight: '产品思维的核心', createdAt: '2026-06-01 21:00:00' },
  { id: 2, userId: 1, courseId: 1, lessonId: 2, content: '用户需求 = 痛点 + 场景 + 频次', highlight: '用户需求', createdAt: '2026-06-02 19:30:00' },
]

const messages = [
  { id: 1, userId: 1, title: '课程更新通知', content: '您购买的「产品经理从入门到精通」已更新第3章内容', type: 'system', isRead: false, createdAt: '2026-06-03 09:00:00' },
  { id: 2, userId: 1, title: '拼团成功', content: '您参与的「每天10分钟·提升表达力」拼团已成功！', type: 'order', isRead: false, createdAt: '2026-06-02 15:00:00' },
  { id: 3, userId: 1, title: '优惠券到账', content: '您有一张满99减30优惠券已到账，快去使用吧！', type: 'coupon', isRead: true, createdAt: '2026-06-01 10:00:00' },
]

const users = [
  { id: 1, phone: '13800138001', nickname: '学习达人', avatar: '', balance: 100, createdAt: '2026-05-01' },
  { id: 2, phone: '13800138002', nickname: '知识探索者', avatar: '', balance: 50, createdAt: '2026-05-15' },
  { id: 3, phone: '13800138003', nickname: '成长路上的我', avatar: '', balance: 200, createdAt: '2026-05-20' },
]

module.exports = {
  banners, categories, teachers, courses, reviews, coupons,
  seckillCourses, groupBuys, orders, userCourses, favorites,
  notes, messages, users,
}
