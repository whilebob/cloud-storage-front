<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <!-- 左侧Logo和菜单按钮（移动端） -->
        <div class="header-left">
          <!-- 移动端菜单按钮 -->
          <el-button 
            v-if="isMobile" 
            class="mobile-menu-btn" 
            @click="toggleMobileMenu"
            type="text"
            circle
          >
            <el-icon>
              <component :is="isMobileMenuOpen ? 'Close' : 'Menu'" />
            </el-icon>
          </el-button>
          
          <!-- Logo区域 -->
          <div class="logo-container" @click="handleLogoClick">
            <div class="logo-icon">
              <svg class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text" v-show="!isMobile || windowWidth > 400">
              <h1 class="app-title">{{ isMobile ? '云存储' : '云存储' }}</h1>
              <p class="app-subtitle" v-if="!isMobile">Cloud Storage</p>
            </div>
          </div>
        </div>

        <!-- 中间导航栏 -->
        <div class="header-center" v-show="!isMobile">
          <div class="navigation-tabs">
            <el-button
              v-for="tab in quickTabs"
              :key="tab.path"
              :type="activeQuickTab === tab.path ? 'primary' : 'text'"
              class="nav-tab"
              @click="handleQuickTab(tab.path)"
            >
              <el-icon>
                <component :is="tab.icon" />
              </el-icon>
              <span>{{ tab.name }}</span>
            </el-button>
          </div>
        </div>

        <!-- 右侧用户区域 -->
        <div class="header-right">
          <!-- 桌面端侧边栏折叠按钮 -->
          <el-button 
            v-if="!isMobile" 
            class="sidebar-toggle-btn" 
            @click="toggleSidebar"
            type="text"
            circle
          >
            <el-icon>
              <component :is="isSidebarCollapsed ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
          
          <!-- 移动端当前位置指示器 -->
          <div v-if="isMobile" class="mobile-current-page">
            <span>{{ getCurrentPageName }}</span>
          </div>
          
          <!-- 用户信息 -->
          <div class="user-actions">
            <el-dropdown trigger="click" class="user-dropdown">
              <div class="user-profile">
                <el-avatar 
                  :size="isMobile ? 32 : 36" 
                  :src="userAvatar"
                  class="user-avatar"
                >
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="user-info" v-if="!isMobile">
                  <span class="user-name">{{ userName }}</span>
                  <span class="user-status">在线</span>
                </div>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item divided @click="handleLogout" class="logout-item">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 桌面端侧边栏 -->
      <aside v-if="!isMobile" class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <nav class="sidebar-nav">
          <el-menu
            :default-active="activeMenu"
            :collapse="isSidebarCollapsed"
            class="sidebar-menu"
            router
            @select="handleMenuSelect"
          >
            <el-menu-item index="/index" class="menu-item">
              <el-icon class="menu-icon">
                <House />
              </el-icon>
              <span class="menu-text">首页概览</span>
            </el-menu-item>

            <el-menu-item index="/index/files" class="menu-item">
              <el-icon class="menu-icon">
                <Folder />
              </el-icon>
              <span class="menu-text">文件管理</span>
            </el-menu-item>

            <el-menu-item index="/index/upload" class="menu-item">
              <el-icon class="menu-icon">
                <Upload />
              </el-icon>
              <span class="menu-text">上传文件</span>
            </el-menu-item>
          </el-menu>
        </nav>
      </aside>

      <!-- 移动端侧边栏抽屉 -->
      <el-drawer
        v-if="isMobile"
        v-model="isMobileMenuOpen"
        title="导航菜单"
        direction="ltr"
        size="280px"
        :with-header="false"
      >
        <div class="mobile-sidebar">
          <nav class="sidebar-nav">
            <el-menu
              :default-active="activeMenu"
              class="sidebar-menu"
              router
              @select="handleMobileMenuSelect"
            >
              <el-menu-item index="/index" class="menu-item">
                <el-icon class="menu-icon">
                  <House />
                </el-icon>
                <span class="menu-text">首页概览</span>
              </el-menu-item>

              <el-menu-item index="/index/files" class="menu-item">
                <el-icon class="menu-icon">
                  <Folder />
                </el-icon>
                <span class="menu-text">文件管理</span>
              </el-menu-item>

              <el-menu-item index="/index/upload" class="menu-item">
                <el-icon class="menu-icon">
                  <Upload />
                </el-icon>
                <span class="menu-text">上传文件</span>
              </el-menu-item>
            </el-menu>
          </nav>
          
          <div class="mobile-user-info">
            <el-avatar 
              :size="48" 
              :src="userAvatar"
              class="mobile-user-avatar"
            >
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="mobile-user-details">
              <span class="mobile-user-name">{{ userName }}</span>
              <span class="mobile-user-status">在线</span>
            </div>
            <el-button 
              class="mobile-logout-btn" 
              @click="handleLogout"
              type="danger"
              text
            >
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-button>
          </div>
        </div>
      </el-drawer>

      <!-- 内容区域 -->
      <section class="content-wrapper" :class="{ 
        'sidebar-collapsed': !isMobile && isSidebarCollapsed,
        'mobile-view': isMobile 
      }">
        <!-- 主要内容 -->
        <div class="content-container">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  House, 
  Folder, 
  Upload, 
  User,
  ArrowDown,
  SwitchButton,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/utils/index'
import { other_routes } from '@/router/index'

const router = useRouter()
const route = useRoute()

// 响应式数据
const activeMenu = ref('/index')
const activeQuickTab = ref('/index')
const isSidebarCollapsed = ref(false)
const isMobile = ref(false)
const isMobileMenuOpen = ref(false)
const windowWidth = ref(window.innerWidth)
const userAvatar = ref('')
const userName = ref('用户')

// 快速导航标签
const quickTabs = [
  { name: '首页', path: '/index', icon: 'House' },
  { name: '文件', path: '/index/files', icon: 'Folder' },
  { name: '上传', path: '/index/upload', icon: 'Upload' }
]

// 计算属性
const getCurrentPageName = computed(() => {
  const currentPath = route.path
  if (currentPath === '/index') return '首页'
  if (currentPath === '/index/files') return '文件管理'
  if (currentPath === '/index/upload') return '上传文件'
  return '云存储'
})

// 方法
const checkMobile = () => {
  windowWidth.value = window.innerWidth
  isMobile.value = windowWidth.value < 768
}

const handleLogoClick = () => {
  router.push('/index')
  activeQuickTab.value = '/index'
  activeMenu.value = '/index'
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const handleMenuSelect = (index) => {
  activeMenu.value = index
  activeQuickTab.value = index
}

const handleMobileMenuSelect = (index) => {
  activeMenu.value = index
  activeQuickTab.value = index
  isMobileMenuOpen.value = false
}

const handleQuickTab = (path) => {
  activeQuickTab.value = path
  router.push(path)
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const response = await http.post('/user/logout')
    const {code,data} = response
    ElMessage.info(data)
    if (code === 200 ) {
      ElMessage.success('退出成功,页面将跳转到登录页')
      localStorage.removeItem('token')
      setTimeout(() => {
        other_routes.push('/')
      }, 300)
    }
  } catch (error) {
    console.log('用户取消退出')
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
  activeQuickTab.value = newPath
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
})

onMounted(() => {
  activeMenu.value = route.path
  activeQuickTab.value = route.path
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  overflow: hidden;
}

/* 顶部导航栏 */
.app-header {
  height: 60px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

/* 左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-width: 0;
}

.mobile-menu-btn {
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 4px 8px;
  border-radius: 8px;
  min-width: 0;
  flex: 1;
  
  &:hover {
    transform: translateY(-1px);
    background: rgba(102, 126, 234, 0.05);
  }
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  color: white;
  flex-shrink: 0;
}

.logo-svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
}

.app-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.app-subtitle {
  font-size: 10px;
  color: #999;
  margin: 0;
  font-weight: 400;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

/* 中间导航栏 */
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.navigation-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
  flex-shrink: 0;
  
  &.is-active {
    background: white;
    color: #409eff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  &:hover:not(.is-active) {
    background: rgba(64, 158, 255, 0.08);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 0;
}

.sidebar-toggle-btn {
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }
}

.mobile-current-page {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  min-width: 0;
  padding: 0 8px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.user-dropdown {
  cursor: pointer;
  flex-shrink: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  overflow: hidden;
  
  &:hover {
    background: white;
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 12px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  font-size: 10px;
  color: #67c23a;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: #999;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  font-size: 12px;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.logout-item {
  color: #f56c6c;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(245, 108, 108, 0.1);
  }
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
}

/* 桌面端侧边栏 */
.sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  flex-shrink: 0;
  overflow: hidden;
  min-width: 0;
  
  &.sidebar-collapsed {
    width: 60px;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow: hidden;
  min-width: 0;
}

.sidebar-menu {
  background: transparent;
  border: none;
  padding: 0 8px;
  min-width: 0;
  
  :deep(.el-menu-item) {
    height: 44px;
    line-height: 44px;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: #666;
    font-weight: 500;
    font-size: 13px;
    min-width: 0;
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
      color: #409eff;
      transform: translateX(2px);
    }
    
    &:active {
      transform: translateX(0);
    }
    
    &.is-active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      color: #409eff;
    }
  }
  
  :deep(.el-menu-item .el-icon) {
    width: 20px;
    height: 20px;
    font-size: 18px;
    flex-shrink: 0;
  }
  
  :deep(.el-menu-item) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px !important;
  }
}

.menu-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  opacity: 1;
  flex-shrink: 0;
  min-width: 0;
  
  .sidebar-collapsed & {
    opacity: 0;
    width: 0;
  }
}

/* 移动端侧边栏抽屉 */
.mobile-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-user-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: auto;
  min-width: 0;
}

.mobile-user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.mobile-user-name {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  min-width: 0;
}

.mobile-user-status {
  font-size: 12px;
  color: #67c23a;
  font-weight: 500;
}

.mobile-logout-btn {
  width: 100%;
  padding: 10px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: calc(100% - 240px);
  min-width: 0;
  
  &.sidebar-collapsed {
    width: calc(100% - 60px);
  }
  
  &.mobile-view {
    width: 100%;
    padding: 12px 16px;
  }
}

.content-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: auto;
  padding: 24px;
  -webkit-overflow-scrolling: touch;
  min-width: 0;
  min-height: 0;
}

/* 移动端内容容器 */
.mobile-view .content-container {
  padding: 16px;
  border-radius: 8px;
}

/* 平滑滚动 */
.content-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.content-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.content-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.content-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }
  
  .header-content {
    gap: 8px;
  }
  
  .logo-text {
    display: none;
  }
  
  .mobile-current-page {
    display: block;
    font-size: 13px;
    max-width: 100px;
  }
  
  .user-profile {
    padding: 4px;
  }
  
  .user-info {
    display: none;
  }
  
  .dropdown-icon {
    display: none;
  }
}

@media (max-width: 480px) {
  .mobile-current-page {
    display: none;
  }
  
  .content-wrapper {
    padding: 8px 12px;
  }
  
  .content-container {
    padding: 12px;
  }
}

@media (max-width: 320px) {
  .logo-icon {
    width: 28px;
    height: 28px;
  }
  
  .mobile-menu-btn {
    min-width: 36px;
    min-height: 36px;
  }
  
  .user-avatar {
    width: 28px !important;
    height: 28px !important;
  }
}
</style>