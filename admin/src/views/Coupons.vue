<template>
  <div class="page">
    <div class="page-header flex-between">
      <h2>🎫 优惠券管理</h2>
      <el-button type="primary" @click="onAdd"><el-icon><Plus /></el-icon> 新增优惠券</el-button>
    </div>
    <div class="page-content">
      <el-table :data="data" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="180" />
        <el-table-column label="类型" width="120"><template #default="s"><el-tag>{{ s.row.type === 'discount' ? '折扣券' : s.row.type === 'cut' ? '立减券' : '满减券' }}</el-tag></template></el-table-column>
        <el-table-column label="面值" width="120">
          <template #default="s">
            <span v-if="s.row.type === 'discount'">{{ s.row.value }}折</span>
            <span v-else>¥{{ s.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="120" />
        <el-table-column prop="totalCount" label="发放数量" width="120" />
        <el-table-column prop="usedCount" label="已使用" width="100" />
        <el-table-column label="有效期" width="200"><template #default="s">{{ s.row.startDate }} ~ {{ s.row.endDate }}</template></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="s"><el-tag :type="s.row.status === 'active' ? 'success' : 'info'">{{ s.row.status === 'active' ? '进行中' : '已结束' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="s">
            <el-button type="text" size="small" @click="onEdit(s.row)">编辑</el-button>
            <el-button type="text" size="small" type="danger" @click="onDelete(s.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editDialogVisible" title="优惠券信息" width="520px" destroy-on-close>
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="优惠券名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="editForm.type" style="width: 100%;"><el-option label="折扣券" value="discount" /><el-option label="立减券" value="cut" /><el-option label="满减券" value="fullCut" /></el-select></el-form-item>
        <el-form-item label="面值"><el-input-number v-model="editForm.value" :min="0" /></el-form-item>
        <el-form-item label="最低消费"><el-input-number v-model="editForm.minAmount" :min="0" /></el-form-item>
        <el-form-item label="发放数量"><el-input-number v-model="editForm.totalCount" :min="1" /></el-form-item>
        <el-form-item label="有效期">
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="状态"><el-select v-model="editForm.status"><el-option label="进行中" value="active" /><el-option label="已结束" value="ended" /></el-select></el-form-item>
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
const dateRange = ref([])

async function loadData() {
  try {
    const res = await request.get('/admin/coupons')
    data.value = res.coupons || res
    loading.value = false
  } catch (e) { loading.value = false }
}

function onAdd() {
  editForm.value = { name: '', type: 'fullCut', value: 10, minAmount: 99, totalCount: 100, status: 'active' }
  dateRange.value = []
  editDialogVisible.value = true
}

function onEdit(row) {
  editForm.value = { ...row }
  dateRange.value = [row.startDate, row.endDate]
  editDialogVisible.value = true
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除该优惠券吗？', '警告', { type: 'error' })
    data.value = data.value.filter(c => c.id !== row.id)
    ElMessage.success('删除成功')
  } catch (e) {}
}

async function onSave() {
  try {
    if (dateRange.value?.length === 2) {
      editForm.value.startDate = dateRange.value[0]
      editForm.value.endDate = dateRange.value[1]
    }
    if (editForm.value.id) {
      await request.put(`/admin/coupons/${editForm.value.id}`, editForm.value)
    } else {
      const res = await request.post('/admin/coupons', editForm.value)
      editForm.value.id = res.id || Date.now()
      editForm.value.usedCount = 0
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
</style>
