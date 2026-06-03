<template>
  <div class="page">
    <div class="page-header flex-between">
      <h2>⏰ 秒杀活动管理</h2>
      <el-button type="primary" @click="onAdd"><el-icon><Plus /></el-icon> 新增秒杀</el-button>
    </div>
    <div class="page-content">
      <el-table :data="data" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="课程封面" width="100"><template #default="s"><el-image :src="s.row.course?.cover" style="width: 80px; height: 56px; border-radius: 4px;" fit="cover" /></template></el-table-column>
        <el-table-column prop="title" label="活动名称" min-width="180" />
        <el-table-column label="课程价格" width="140">
          <template #default="s">
            <span class="seckill-price">¥{{ s.row.price }}</span>
            <span class="original-price">¥{{ s.row.originalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100"><template #default="s">{{ s.row.soldCount }}/{{ s.row.totalCount }}</template></el-table-column>
        <el-table-column label="活动时间" width="260"><template #default="s">{{ s.row.startTime }}<br />~ {{ s.row.endTime }}</template></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="s">
            <el-tag :type="s.row.status" size="small">
              {{ s.row.status === 'active' ? '进行中' : s.row.status === 'upcoming' ? '未开始' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="s">
            <el-button type="text" size="small" @click="onEdit(s.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #f56c6c;" @click="onDelete(s.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editDialogVisible" title="秒杀活动" width="560px" destroy-on-close>
      <el-form :model="editForm" label-width="110px">
        <el-form-item label="活动名称"><el-input v-model="editForm.title" /></el-form-item>
        <el-form-item label="秒杀价格"><el-input-number v-model="editForm.price" :min="0" /></el-form-item>
        <el-form-item label="秒杀库存"><el-input-number v-model="editForm.totalCount" :min="1" /></el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="timeRange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" value-format="YYYY-MM-DD HH:mm" />
        </el-form-item>
        <el-form-item label="状态"><el-select v-model="editForm.status"><el-option label="未开始" value="upcoming" /><el-option label="进行中" value="active" /><el-option label="已结束" value="ended" /></el-select></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../api'

const loading = ref(true)
const data = ref([])
const editDialogVisible = ref(false)
const editForm = ref({})
const timeRange = ref([])

async function loadData() {
  try {
    const res = await request.get('/admin/seckills')
    data.value = res.seckills || res
    loading.value = false
  } catch (e) { loading.value = false }
}

function onAdd() {
  editForm.value = { title: '', price: 9.9, totalCount: 50, status: 'upcoming' }
  timeRange.value = []
  editDialogVisible.value = true
}

function onEdit(row) {
  editForm.value = { ...row }
  timeRange.value = [row.startTime, row.endTime]
  editDialogVisible.value = true
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除该秒杀活动吗？', '警告', { type: 'error' })
    data.value = data.value.filter(c => c.id !== row.id)
    ElMessage.success('删除成功')
  } catch (e) {}
}

async function onSave() {
  try {
    if (timeRange.value?.length === 2) {
      editForm.value.startTime = timeRange.value[0]
      editForm.value.endTime = timeRange.value[1]
    }
    if (editForm.value.id) {
      await request.put(`/admin/seckills/${editForm.value.id}`, editForm.value)
    } else {
      const res = await request.post('/admin/seckills', editForm.value)
      editForm.value.id = res.id || Date.now()
      editForm.value.soldCount = 0
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
.seckill-price { color: #ff6b35; font-weight: bold; font-size: 16px; }
.original-price { color: #999; text-decoration: line-through; margin-left: 8px; font-size: 13px; }
</style>
