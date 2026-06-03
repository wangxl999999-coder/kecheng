<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <el-icon class="login-icon"><Reading /></el-icon>
        <h1>知趣课堂管理后台</h1>
        <p>知识付费学习平台管理系统</p>
      </div>
      <el-form ref="form" :model="form" label-width="80px" @keyup.enter="onLogin">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click="onLogin">登录</el-button>
      </el-form>
      <div class="login-tips">
        <p>测试账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import request from '../api'

const router = useRouter()
const form = ref({ username: 'admin', password: '123456' })
const loading = ref(false)

async function onLogin() {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  try {
    loading.value = true
    const res = await request.post('/admin/login', form.value)
    localStorage.setItem('adminToken', res.token)
    localStorage.setItem('adminInfo', JSON.stringify(res.adminInfo))
    ElMessage.success('登录成功')
    setTimeout(() => location.reload(), 500)
  } catch (e) {
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.login-header {
  text-align: center;
  margin-bottom: 30px;
}
.login-icon {
  font-size: 60px;
  color: #ff6b35;
}
.login-header h1 {
  font-size: 24px;
  color: #333;
  margin: 10px 0 8px;
}
.login-header p {
  color: #999;
  font-size: 14px;
}
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}
.login-tips {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 13px;
}
</style>
