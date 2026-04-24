<template>
  <div class="login-container">
    <!-- 背景 -->
    <div class="login-bg"></div>
    
    <!-- 登录卡片 -->
    <el-card class="login-card" shadow="always">
      <!-- 标题区域 -->
      <div class="login-header">
        <el-icon class="logo-icon"><Cloudy /></el-icon>
        <h1 class="system-title">云存储</h1>
        <p class="system-subtitle">安全、高效、可靠的云端存储解决方案</p>
      </div>
      
      <!-- 选项卡 -->
      <el-tabs v-model="activeTab" stretch class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form 
            :model="loginForm" 
            :rules="loginRules" 
            ref="loginFormRef" 
            class="login-form"
            label-position="top"
            :disabled="loginLoading"
          >
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码" 
                show-password
                size="large"
                :prefix-icon="Lock"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="handleLogin" 
                :loading="loginLoading"
                class="submit-btn"
                size="large"
                style="width: 100%;"
              >
                {{ loginLoading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
            
            <div class="form-footer">
              <span class="hint-text">还没有账号？</span>
              <el-button 
                type="text" 
                class="switch-btn" 
                @click="activeTab = 'register'"
              >
                立即注册
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="注册" name="register">
          <el-form 
            :model="registerForm" 
            :rules="registerRules" 
            ref="registerFormRef" 
            class="login-form"
            label-position="top"
            :disabled="registerLoading"
          >
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="请输入密码" 
                show-password
                size="large"
                :prefix-icon="Lock"
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="请确认密码"
                show-password
                size="large"
                :prefix-icon="Lock"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="handleRegister" 
                :loading="registerLoading"
                class="submit-btn"
                size="large"
                style="width: 100%;"
              >
                {{ registerLoading ? '注册中...' : '注册' }}
              </el-button>
            </el-form-item>
            
            <div class="form-footer">
              <span class="hint-text">已有账号？</span>
              <el-button 
                type="text" 
                class="switch-btn" 
                @click="activeTab = 'login'"
              >
                立即登录
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 底部信息 -->
      <div class="login-footer">
        <p>© 2026 云存储系统 | 让数据更安全，让存储更简单</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, Cloudy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'
import http from '@/utils/index.js'

// 激活的标签页
const activeTab = ref('login')

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 表单引用
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loginLoading.value = true

    const response = await http.post('/user/login', loginForm)
    const { token } = response.data
    
    if (token) {
      localStorage.setItem('token', token)
      ElMessage.success('登录成功')
      await router.push({ name: 'Index' })
    } else {
      ElMessage.error('登录失败：未获取到token')
    }
  } catch (error) {
    ElMessage.error('登录失败：' + (error.response?.data?.message || '网络错误'))
  } finally {
    loginLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    registerLoading.value = true

    const registerData = {
      username: registerForm.username,
      password: registerForm.password
    }

    await http.post('/user/register', registerData)
    
    ElMessage.success('注册成功，请登录')
    activeTab.value = 'login'
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error('注册失败：' + (error.response?.data?.message || '网络错误'))
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/src/assets/BB1msBaD.jpeg');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  filter: blur(2px);
}

.login-card {
  width: 100%;
  max-width: 440px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: none;
  animation: slideUp 0.5s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  padding-top: 8px;
}

.logo-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.system-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.system-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.login-tabs {
  :deep(.el-tabs__nav-wrap)::after {
    display: none;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
    
    &.is-active {
      color: #409eff;
    }
  }
  
  :deep(.el-tabs__active-bar) {
    background-color: #409eff;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
    font-size: 14px;
  }
  
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    transition: all 0.3s;
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    }
  }
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.hint-text {
  color: #606266;
  font-size: 14px;
}

.switch-btn {
  padding: 0;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: #409eff;
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  color: #909399;
  font-size: 12px;
  opacity: 0.8;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px;
  }
  
  .system-title {
    font-size: 24px;
  }
}
</style>