<template>
  <div class="page">
    <div class="page-header flex-between">
      <h2>📋 订单管理</h2>
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索订单号/课程" style="width: 280px; margin-right: 12px;" clearable />
        <el-select v-model="statusFilter" placeholder="订单状态" style="width: 140px; margin-right: 12px;" clearable>
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button type="primary" @click="loadData">搜索</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-table :data="filteredData" v-loading="loading" stripe>
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="courseTitle" label="课程名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column label="订单类型" width="120"><template #default="s"><el-tag size="small">{{ s.row.type === 'group' ? '拼团购买' : '单独购买' }}</el-tag></template></el-table-column>
        <el-table-column label="金额" width="120"><span class="amount">¥{{ s.row.amount }}</span></el-table-column>
        <el-table-column label="支付方式" width="120"><template #default="s">{{ s.row.payMethod || '微信支付' }}</template></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="s">
            <el-tag :type="s.row.status === 'paid' ? 'success' : s.row.status === 'cancelled' ? 'danger' : 'warning'" size="small">
              {{ s.row.status === 'paid' ? '已支付' : s.row.status === 'cancelled' ? '已取消' : '待支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="s">
            <el-button type="text" size="small" @click="onViewDetail(s.row)">详情</el-button>
            <el-button type="text" size="small" type="danger" v-if="s.row.status === 'pending'" @click="onCancel(s.row)">取消订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="total, prev, pager, next" :total="filteredData.length" :page-size="10" />
    </div>

    <el-dialog v-model="detailVisible" title="订单详情" width="560px">
      <el-descriptions v-if="currentOrder" :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentOrder.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ currentOrder.courseTitle }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentOrder.userId }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">{{ currentOrder.type === 'group' ? '拼团购买' : '单独购买' }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentOrder.amount }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ currentOrder.payMethod || '微信支付' }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="currentOrder.status === 'paid' ? 'success' : currentOrder.status === 'cancelled' ? 'danger' : 'warning'" size="small">
            {{ currentOrder.status === 'paid' ? '已支付' : currentOrder.status === 'cancelled' ? '已取消' : '待支付' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付时间" v-if="currentOrder.paidAt">{{ currentOrder.paidAt }}</el-descriptions-item>
      </el-descriptions>
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
const statusFilter = ref('')
const detailVisible = ref(false)
const currentOrder = ref(null)

const filteredData = computed(() => {
  let list = data.value
  if (statusFilter.value) list = list.filter(o => o.status === statusFilter.value)
  if (keyword.value) list = list.filter(o => String(o.id).includes(keyword.value) || o.courseTitle.includes(keyword.value))
  return list
})

async function loadData() {
  try {
    const res = await request.get('/admin/orders')
    data.value = res.orders || res
    loading.value = false
  } catch (e) { loading.value = false }
}

function onViewDetail(row) {
  currentOrder.value = { ...row }
  detailVisible.value = true
}

async function onCancel(row) {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', { type: 'warning' })
    row.status = 'cancelled'
    ElMessage.success('订单已取消')
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
.amount { color: #ff6b35; font-weight: bold; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
