<template>
  <div id="app" class="admin-layout" v-if="isLogin">
    <el-container>
      <el-aside width="240px" class="sidebar">
        <div class="logo">
          <el-icon><Reading /></el-icon>
          <span>知趣课堂</span>
        </div>
        <el-menu :default-active="route.path" router>
          <el-menu-item index="/">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/courses">
            <el-icon><VideoCamera /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/coupons">
            <el-icon><Ticket /></el-icon>
            <span>优惠券管理</span>
          </el-menu-item>
          <el-menu-item index="/seckills">
            <el-icon><Clock /></el-icon>
            <span>秒杀活动管理</span>
          </el-menu-item>
          <el-menu-item index="/orders">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-title">知识付费管理系统</div>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><UserFilled /></el-icon>
              管理员
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div id="app" v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const isLogin = ref(false)

onMounted(() => {
  const token = localStorage.getItem('adminToken')
  isLogin.value = !!token
  if (!token && route.path !== '/login') router.push('/login')
  else if (token && route.path === '/login') router.push('/')
})

function handleCommand(cmd) {
  if (cmd === 'logout') {
    localStorage.removeItem('adminToken')
    isLogin.value = false
    router.push('/login')
    ElMessage.success('已退出登录')
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.admin-layout { height: 100vh; }
.sidebar { background: #304156; color: #fff; }
.sidebar .logo { display: flex; align-items: center; justify-content: center; height: 60px; font-size: 20px; font-weight: bold; color: #fff; background: #2b3648; }
.sidebar .logo .el-icon { margin-right: 10px; font-size: 24px; }
.el-menu { border-right: none; background: #304156; }
.el-menu-item { color: #bfcbd9; }
.el-menu-item.is-active { background: #ff6b35; color: #fff; }
.el-menu-item:hover { color: #ff6b35; }
.header { background: #fff; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e6e6e6; }
.header-title { font-size: 18px; font-weight: bold; color: #333; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #666; }
.main-content { background: #f5f7fa; padding: 20px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
