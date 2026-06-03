<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>📊 数据概览</h2>
    </div>
    <el-row :gutter="20">
      <el-col :span="6"><div class="stat-card card-1"><div class="stat-num">12,580</div><div class="stat-label">用户总数</div><div class="stat-trend up">↑ 12.5%</div></div></el-col>
      <el-col :span="6"><div class="stat-card card-2"><div class="stat-num">328</div><div class="stat-label">课程总数</div><div class="stat-trend up">↑ 8.3%</div></div></el-col>
      <el-col :span="6"><div class="stat-card card-3"><div class="stat-num">¥298,450</div><div class="stat-label">销售总额</div><div class="stat-trend up">↑ 23.8%</div></div></el-col>
      <el-col :span="6"><div class="stat-card card-4"><div class="stat-num">3,420</div><div class="stat-label">订单总数</div><div class="stat-trend up">↑ 15.2%</div></div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-title">📈 销售趋势</div>
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-title">📚 课程分类销售</div>
          <div ref="pieRef" class="chart-container pie"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref()
const pieRef = ref()

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{ data: [12000, 19000, 25000, 32000, 45000, 58000], type: 'line', smooth: true, areaStyle: { color: 'rgba(255,107,53,0.1)' }, lineStyle: { color: '#ff6b35', width: 3 }, itemStyle: { color: '#ff6b35' } }]
  })

  const pie = echarts.init(pieRef.value)
  pie.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: [
        { value: 1048, name: '视频课' },
        { value: 735, name: '音频课' },
        { value: 580, name: '图文专栏' },
        { value: 484, name: '直播课' },
        { value: 300, name: '训练营' },
      ],
      color: ['#ff6b35', '#4caf50', '#2196f3', '#9c27b0', '#ff9800']
    }]
  })

  window.addEventListener('resize', () => { chart.resize(); pie.resize() })
})
</script>

<style scoped>
.dashboard { padding: 0; }
.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 20px; color: #333; }
.stat-card { padding: 24px; border-radius: 12px; color: #fff; position: relative; overflow: hidden; }
.stat-card::before { content: ''; position: absolute; right: -20px; top: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; }
.card-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.card-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.card-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.card-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-num { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
.stat-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
.stat-trend { font-size: 13px; }
.stat-trend.up { color: #c8e6c9; }
.chart-card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.chart-title { font-size: 16px; font-weight: bold; margin-bottom: 16px; color: #333; }
.chart-container { height: 300px; }
.chart-container.pie { height: 300px; }
</style>
