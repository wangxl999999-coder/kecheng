<template>
  <div class="page">
    <div class="page-header flex-between">
      <h2>👥 用户管理</h2>
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索手机号/昵称" style="width: 300px; margin-right: 12px;" clearable>
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="loadData">搜索</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-table :data="filteredData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80"><template #default="s"><el-avatar :src="s.row.avatar" size="40" /></template></el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column label="VIP" width="100"><template #default="s"><el-tag :type="s.row.isVip ? 'success' : 'info'">{{ s.row.isVip ? '是' : '否' }}</el-tag></template></el-table-column>
        <el-table-column label="已购课程" width="120"><template #default="s">{{ s.row.purchasedCourses?.length || 0 }}门</template></el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="s">
            <el-button type="text" size="small" @click="onEdit(s.row)">编辑</el-button>
            <el-button type="text" size="small" :type="s.row.status === 'active' ? 'danger' : 'success'" @click="toggleStatus(s.row)">{{ s.row.status === 'active' ? '禁用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="total, prev, pager, next" :total="filteredData.length" :page-size="10" />
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑用户" width="480px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="VIP"><el-switch v-model="editForm.isVip" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="editForm.status"><el-option label="正常" value="active" /><el-option label="禁用" value="disabled" /></el-select></el-form-item>
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

const loading = ref(true)
const data = ref([])
const keyword = ref('')
const editDialogVisible = ref(false)
const editForm = ref({})

const filteredData = computed(() => {
  if (!keyword.value) return data.value
  return data.value.filter(u => u.nickname.includes(keyword.value) || u.phone.includes(keyword.value))
})

async function loadData() {
  try {
    const res = await request.get('/admin/users')
    data.value = res.users || res
    loading.value = false
  } catch (e) { loading.value = false }
}

function onEdit(row) {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

async function toggleStatus(row) {
  try {
    await ElMessageBox.confirm(`确定要${row.status === 'active' ? '禁用' : '启用'}该用户吗？`, '提示', { type: 'warning' })
    row.status = row.status === 'active' ? 'disabled' : 'active'
    ElMessage.success('操作成功')
  } catch (e) {}
}

async function onSave() {
  try {
    await request.put(`/admin/users/${editForm.value.id}`, editForm.value)
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
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
</style>
