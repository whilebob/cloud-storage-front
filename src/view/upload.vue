<template>
  <div class="upload-page">
    <!-- 头部 -->
    <div class="upload-header">
      <h1 class="page-title">上传文件</h1>
      <p class="page-subtitle">将文件上传到云端存储</p>
    </div>

    <!-- 主上传区域 -->
    <el-card class="upload-main-card" shadow="never">
      <div class="upload-container">
        <!-- 拖拽上传区 -->
        <el-upload
          class="upload-area"
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false"
          :disabled="uploading"
          accept="*"
        >
          <div class="upload-content">
            <el-icon class="upload-icon" :class="{ 'uploading': uploading }">
              <UploadFilled />
            </el-icon>
            <div class="upload-text">
              <p class="upload-title">{{ uploading ? '上传中...' : '拖拽文件到这里' }}</p>
              <p class="upload-sub">{{ uploading ? '请等待上传完成' : '或点击选择文件' }}</p>
            </div>
          </div>
        </el-upload>

        <!-- 上传提示 -->
        <div class="upload-tips">
          <el-alert title="上传说明" type="info" :closable="false">
            <ul class="tips-list">
              <li>支持所有文件类型上传</li>
              <li>单个文件最大支持 500MB</li>
              <li>大文件会自动分片上传</li>
              <li>文件重复会自动秒传</li>
            </ul>
          </el-alert>
        </div>
      </div>
    </el-card>

    <!-- 上传文件详情 -->
    <transition name="fade">
      <el-card v-if="currentFile" class="file-detail-card" shadow="never">
        <div class="detail-header">
          <h3>上传详情</h3>
          <el-button
            v-if="!uploading && currentFile.status !== 'uploading'"
            type="danger"
            text
            @click="clearFile"
          >
            清除
          </el-button>
        </div>

        <div class="file-info">
          <div class="file-icon-name">
            <el-icon class="file-icon">
              <Document />
            </el-icon>
            <div class="file-name-group">
              <span class="file-name" :title="currentFile.name">{{ currentFile.name }}</span>
              <span class="file-size">{{ formatSize(currentFile.size) }}</span>
            </div>
          </div>

          <div class="file-status">
            <el-tag :type="getStatusType(currentFile.status)" size="large" round>
              {{ getStatusText(currentFile.status) }}
            </el-tag>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="currentFile.status === 'uploading'" class="upload-progress">
          <el-progress
            :percentage="currentFile.progress"
            :status="currentFile.status === 'success' ? 'success' : ''"
            :stroke-width="8"
            striped
            striped-flow
          />
          <p class="progress-text">上传中... {{ currentFile.progress }}%</p>
          <p v-if="currentFile.totalChunks" class="chunk-text">
            分片 {{ currentFile.currentChunk || 0 }}/{{ currentFile.totalChunks }}
          </p>
        </div>

        <!-- 上传控制按钮 -->
        <div v-if="currentFile.status === 'ready'" class="upload-controls">
          <el-button
            type="primary"
            size="large"
            @click="startUpload"
            class="upload-btn"
            :loading="uploading"
          >
            <el-icon><Upload /></el-icon>
            开始上传
          </el-button>
        </div>

        <!-- 成功状态显示 -->
        <div v-if="currentFile.status === 'success'" class="success-state">
          <el-icon class="success-icon"><CircleCheck /></el-icon>
          <div class="success-content">
            <p class="success-title">上传成功！</p>
            <p class="success-desc">文件已保存到云端</p>
            <p class="success-time">{{ formatTime(currentFile.successTime) }}</p>
          </div>
          <el-button type="primary" text @click="uploadAnother">上传另一个文件</el-button>
        </div>

        <!-- 错误状态显示 -->
        <div v-if="currentFile.status === 'error'" class="error-state">
          <el-icon class="error-icon"><CircleClose /></el-icon>
          <div class="error-content">
            <p class="error-title">上传失败</p>
            <p class="error-desc" v-if="currentFile.errorMessage">{{ currentFile.errorMessage }}</p>
            <p class="error-desc" v-else>请检查网络连接后重试</p>
          </div>
          <el-button type="primary" @click="retryUpload">重试上传</el-button>
        </div>
      </el-card>
    </transition>

    <transition name="slide-up">
      <div v-if="currentFile?.status === 'success'" class="continue-upload">
        <el-button
          type="primary"
          plain
          size="large"
          @click="uploadAnother"
          class="continue-btn"
        >
          <el-icon><Plus /></el-icon>
          继续上传其他文件
        </el-button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  UploadFilled, 
  Document, 
  Upload, 
  CircleCheck,
  CircleClose,
  Plus
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFileMD5 } from '@/utils/computed.js'
import http from '@/utils'

// 响应式数据
const currentFile = ref(null)
const uploading = ref(false)

// 处理文件选择
const handleFileChange = (uploadFile) => {
  if (uploading.value) {
    ElMessage.warning('当前有文件正在上传，请等待完成')
    return
  }

  const file = uploadFile.raw
  
  if (!file) {
    ElMessage.error('文件读取失败')
    return
  }

  if (currentFile.value) {
    ElMessageBox.confirm(
      '当前已选择文件，是否替换？',
      '提示',
      {
        confirmButtonText: '替换',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      currentFile.value = {
        file: file,
        name: file.name,
        size: file.size,
        status: 'ready',
        progress: 0
      }
    })
  } else {
    currentFile.value = {
      file: file,
      name: file.name,
      size: file.size,
      status: 'ready',
      progress: 0
    }
  }
}

// 清除文件
const clearFile = () => {
  currentFile.value = null
}

// 开始上传
const startUpload = async () => {
  if (!currentFile.value || !currentFile.value.file) return
  
  const fileObj = currentFile.value.file
  const limitSize = 10 * 1024 * 1024 // 10MB
  
  uploading.value = true
  currentFile.value.status = 'uploading'
  currentFile.value.progress = 0
  currentFile.value.errorMessage = ''

  try {
    if (fileObj.size < limitSize) {
      await uploadSmallFile(fileObj)
    } else {
      await uploadLargeFile(fileObj)
    }
  } catch (error) {
    currentFile.value.status = 'error'
    currentFile.value.errorMessage = error.message
    ElMessage.error(`上传失败: ${error.message || '未知错误'}`)
  } finally {
    uploading.value = false
  }
}

// 上传小文件
const uploadSmallFile = async (file) => {
  try {
    const md5 = await getFileMD5(file)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('md5', md5)
    
    const response = await http.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total > 0) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          currentFile.value.progress = progress
        }
      }
    })

    const { message, code } = response
    if (code === 200) {
      currentFile.value.status = 'success'
      currentFile.value.progress = 100
      currentFile.value.successTime = new Date()
      ElMessage.success({
        message: '文件上传成功！',
        duration: 3000,
        showClose: true
      })
    } else if (code === 302) {
      currentFile.value.status = 'success'
      currentFile.value.progress = 100
      currentFile.value.successTime = new Date()
      ElMessage.success({
        message: `文件已秒传成功！`,
        duration: 3000,
        showClose: true
      })
    } else {
      currentFile.value.status = 'error'
      currentFile.value.errorMessage = message
      throw new Error(message || '上传失败')
    }
  } catch (error) {
    currentFile.value.status = 'error'
    currentFile.value.errorMessage = error.message
    throw error
  }
}

// 上传大文件（分片）
const uploadLargeFile = async (file) => {
  try {
    const chunkSize = 5 * 1024 * 1024 // 5MB
    const totalChunks = Math.ceil(file.size / chunkSize)
    
    // 初始化分片信息
    currentFile.value.totalChunks = totalChunks
    currentFile.value.currentChunk = 0
    
    const md5 = await getFileMD5(file)

    // 分片上传
    for (let i = 0; i < totalChunks; i++) {
      // 更新当前分片
      currentFile.value.currentChunk = i + 1
      
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      if (!chunk || chunk.size === 0) {
        throw new Error('分片读取失败')
      }
      
      const chunkMd5 = await getFileMD5(chunk)

      const formData = new FormData()
      formData.append('file', chunk, file.name)
      formData.append('md5', md5)
      formData.append('chunkMd5', chunkMd5)
      formData.append('chunkIndex', i)
      formData.append('totalChunks', totalChunks)

      const response = await http.post('/upload/chunk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total > 0) {
            // 计算单个分片的进度
            const chunkProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            // 计算总进度：已完成的分片 + 当前分片进度
            const baseProgress = (i / totalChunks) * 100
            const currentChunkProgress = (chunkProgress / 100) * (100 / totalChunks)
            const totalProgress = baseProgress + currentChunkProgress
            
            currentFile.value.progress = Math.round(totalProgress)
          }
        }
      })

      if (response.code === 200 && response.data?.toString() === '整个文件已上传') {
        currentFile.value.status = 'success'
        currentFile.value.progress = 100
        currentFile.value.successTime = new Date()
        ElMessage.success({
          message: '文件秒传成功！',
          duration: 3000,
          showClose: true
        })
        return
      }

      if (response.code !== 200) {
        throw new Error(response.message || '分片上传失败')
      }

      // 如果没有进度事件，使用简单的分片计数进度
      if (currentFile.value.progress < Math.round(((i + 1) / totalChunks) * 100)) {
        currentFile.value.progress = Math.round(((i + 1) / totalChunks) * 100)
      }
    }

    // 合并文件
    await mergeFile(md5, totalChunks, file.name)
  } catch (error) {
    currentFile.value.status = 'error'
    currentFile.value.errorMessage = error.message
    throw error
  }
}

// 合并文件
const mergeFile = async (md5, totalChunks, filename) => {
  try {
    const mergeRes = await http.post('/upload/merge', {
      md5,
      filename,
      totalChunks
    })

    if (mergeRes.code !== 200) {
      throw new Error(mergeRes.message || '合并请求失败')
    }

    // 轮询合并状态
    const maxTime = 5 * 60 * 1000 // 5分钟
    const startTime = Date.now()
    const pollInterval = 2000 // 2秒检查一次

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        if (Date.now() - startTime > maxTime) {
          clearInterval(timer)
          reject(new Error('合并超时'))
          return
        }

        try {
          const res = await http.get('/upload/merge/status', {
            params: { md5 }
          })

          const status = res.data?.status
          switch (status) {
            case 'success':
              clearInterval(timer)
              currentFile.value.status = 'success'
              currentFile.value.progress = 100
              currentFile.value.successTime = new Date()
              ElMessage.success({
                message: '文件上传成功！',
                duration: 3000,
                showClose: true
              })
              resolve()
              break
            case 'fail':
              clearInterval(timer)
              reject(new Error('文件合并失败'))
              break
            case 'merging':
              // 合并中，继续轮询
              console.log('文件合并中...')
              break
            default:
              // 其他状态继续等待
              console.log('等待文件合并...')
              break
          }
        } catch (err) {
          clearInterval(timer)
          reject(err)
        }
      }

      const timer = setInterval(checkStatus, pollInterval)
      checkStatus() // 立即执行一次
    })
  } catch (error) {
    currentFile.value.status = 'error'
    currentFile.value.errorMessage = error.message
    throw error
  }
}

// 重试上传
const retryUpload = () => {
  if (currentFile.value) {
    currentFile.value.status = 'ready'
    startUpload()
  }
}

// 上传另一个文件
const uploadAnother = () => {
  currentFile.value = null
}

// 工具函数
const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const getStatusType = (status) => {
  const map = {
    success: 'success',
    error: 'danger',
    uploading: 'primary',
    ready: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    success: '已完成',
    error: '上传失败',
    uploading: '上传中',
    ready: '待上传'
  }
  return map[status] || '未知'
}
</script>

<style scoped>
.upload-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.upload-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.upload-main-card {
  border: 2px dashed #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.upload-main-card:hover {
  border-color: #667eea;
  background: #f3f4f6;
}

.upload-container {
  padding: 40px 20px;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  transition: none;
}

.upload-area :deep(.el-upload-dragger:hover) {
  background: transparent;
  border: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  cursor: pointer;
}

.upload-icon {
  font-size: 72px;
  color: #9ca3af;
  transition: all 0.3s;
  animation: float 3s ease-in-out infinite;
}

.upload-icon.uploading {
  color: #667eea;
  animation: pulse 2s ease-in-out infinite;
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.upload-sub {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

.upload-tips {
  margin-top: 32px;
}

.tips-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
  color: #6b7280;
  font-size: 14px;
}

.tips-list li {
  margin-bottom: 4px;
}

/* 文件详情卡片 */
.file-detail-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  animation: slideIn 0.3s ease-out;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.file-icon-name {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 40px;
  color: #667eea;
  flex-shrink: 0;
}

.file-name-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.file-name {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 13px;
  color: #9ca3af;
}

.file-status {
  flex-shrink: 0;
}

.upload-progress {
  margin: 24px 0;
}

.progress-text {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin: 8px 0 0 0;
  font-weight: 500;
}

.chunk-text {
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  margin: 4px 0 0 0;
}

.upload-controls {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.upload-btn {
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.upload-btn:active {
  transform: translateY(0);
}

/* 成功状态 */
.success-state {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
  background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
  border-radius: 12px;
  border-left: 4px solid #67c23a;
  animation: successFade 0.5s ease-out;
}

.success-icon {
  font-size: 40px;
  color: #67c23a;
  flex-shrink: 0;
}

.success-content {
  flex: 1;
  min-width: 0;
}

.success-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.success-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.success-time {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* 错误状态 */
.error-state {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
  background: linear-gradient(135deg, #fef0f0, #fee);
  border-radius: 12px;
  border-left: 4px solid #f56c6c;
  animation: errorFade 0.5s ease-out;
}

.error-icon {
  font-size: 40px;
  color: #f56c6c;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  min-width: 0;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.error-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 继续上传按钮 */
.continue-upload {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  animation: slideUp 0.3s ease-out;
}

.continue-btn {
  padding: 12px 40px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
}

/* 动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes successFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes errorFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 640px) {
  .upload-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .upload-content {
    padding: 20px;
  }
  
  .upload-icon {
    font-size: 48px;
  }
  
  .upload-title {
    font-size: 18px;
  }
  
  .success-state,
  .error-state {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>