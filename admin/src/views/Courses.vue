<template>
  <div class="page">
    <div class="page-header flex-between">
      <h2>📚 课程管理</h2>
      <div class="actions">
        <el-select v-model="filterType" placeholder="课程分类" style="width: 140px; margin-right: 12px;" clearable>
          <el-option label="视频课" value="video" />
          <el-option label="音频课" value="audio" />
          <el-option label="图文专栏" value="article" />
          <el-option label="直播课" value="live" />
          <el-option label="训练营" value="camp" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索课程/讲师" style="width: 240px; margin-right: 12px;" clearable />
        <el-button type="primary" @click="onAdd"><el-icon><Plus /></el-icon> 新增课程</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-table :data="filteredData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="100"><template #default="s"><el-image :src="s.row.cover" style="width: 80px; height: 56px; border-radius: 4px;" fit="cover" /></template></el-table-column>
        <el-table-column prop="title" label="课程名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="teacherName" label="讲师" width="120" />
        <el-table-column label="类型" width="100"><template #default="s"><el-tag size="small">{{ getTypeName(s.row.type) }}</el-tag></template></el-table-column>
        <el-table-column label="价格" width="120">
          <template #default="s">
            <span class="price">¥{{ s.row.price }}</span>
            <span class="original-price" v-if="s.row.originalPrice">¥{{ s.row.originalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="buyCount" label="购买人数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="s"><el-tag :type="s.row.status === 'published' ? 'success' : 'info'" size="small">{{ s.row.status === 'published' ? '已上架' : '已下架' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="s">
            <el-button type="text" size="small" @click="onEdit(s.row)">编辑</el-button>
            <el-button type="text" size="small" :style="{ color: s.row.status === 'published' ? '#e6a23c' : '#67c23a' }" @click="toggleStatus(s.row)">{{ s.row.status === 'published' ? '下架' : '上架' }}</el-button>
            <el-button type="text" size="small" style="color: #f56c6c;" @click="onDelete(s.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editDialogVisible" title="课程信息" width="640px" destroy-on-close>
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="课程名称"><el-input v-model="editForm.title" /></el-form-item>
        <el-form-item label="课程类型"><el-select v-model="editForm.type" style="width: 100%;"><el-option v-for="t in types" :key="t.value" :label="t.label" :value="t.value" /></el-select></el-form-item>
        <el-form-item label="讲师"><el-input v-model="editForm.teacherName" /></el-form-item>
        <el-form-item label="售价"><el-input-number v-model="editForm.price" :min="0" /></el-form-item>
        <el-form-item label="原价"><el-input-number v-model="editForm.originalPrice" :min="0" /></el-form-item>
        <el-form-item label="课时数"><el-input-number v-model="editForm.lessonCount" :min="1" /></el-form-item>
        <el-form-item label="课程介绍"><el-input v-model="editForm.intro" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="editForm.status"><el-option label="上架" value="published" /><el-option label="下架" value="draft" /></el-select></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../api'

const types = [
  { label: '视频课', value: 'video' },
  { label: '音频课', value: 'audio' },
  { label: '图文专栏', value: 'article' },
  { label: '直播课', value: 'live' },
  { label: '训练营', value: 'camp' },
]

const loading = ref(true)
const data = ref([])
const keyword = ref('')
const filterType = ref('')
const editDialogVisible = ref(false)
const editForm = ref({})

const filteredData = computed(() => {
  let list = data.value
  if (filterType.value) list = list.filter(c => c.type === filterType.value)
  if (keyword.value) list = list.filter(c => c.title.includes(keyword.value) || c.teacherName.includes(keyword.value))
  return list
})

function getTypeName(type) { return types.find(t => t.value === type)?.label || type }

async function loadData() {
  try {
    const res = await request.get('/admin/courses')
    data.value = res.courses || res
    loading.value = false
  } catch (e) { loading.value = false }
}

function onAdd() {
  editForm.value = { title: '', type: 'video', teacherName: '', price: 0, originalPrice: 0, lessonCount: 10, intro: '', status: 'published' }
  editDialogVisible.value = true
}

function onEdit(row) {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

async function toggleStatus(row) {
  try {
    await ElMessageBox.confirm(`确定要${row.status === 'published' ? '下架' : '上架'}该课程吗？`, '提示', { type: 'warning' })
    row.status = row.status === 'published' ? 'draft' : 'published'
    ElMessage.success('操作成功')
  } catch (e) {}
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除该课程吗？此操作不可恢复！', '警告', { type: 'error' })
    data.value = data.value.filter(c => c.id !== row.id)
    ElMessage.success('删除成功')
  } catch (e) {}
}

async function onSave() {
  try {
    if (editForm.value.id) {
      await request.put(`/admin/courses/${editForm.value.id}`, editForm.value)
    } else {
      const res = await request.post('/admin/courses', editForm.value)
      editForm.value.id = res.id || Date.now()
      data.value.unshift(editForm.value)
    }
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    loadData()
  } catch (e) {}
}

onMounted(loadData)
</script>

<style scoped>
.page { padding: 0; }
.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 20px; color: #333; }
.page-content { background: #fff; border-radius: 8px; padding: 16px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ff6b35; font-weight: bold; font-size: 16px; }
.original-price { color: #999; text-decoration: line-through; margin-left: 8px; font-size: 13px; }
</style>
