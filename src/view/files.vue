<template>
  <div class="file-manager-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div>
        <h1 class="page-title">文件管理 <el-tag type="success" size="small" effect="plain">支持在线预览</el-tag></h1>
        <p class="page-subtitle">管理您所有的云端文件</p>
      </div>

      <div class="header-stats">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <span class="stat-value">{{ totalFiles }}</span>
            <span class="stat-label">个文件</span>
          </div>
        </el-card>
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <span class="stat-value">{{ formatFileSize(totalSize) }}</span>
            <span class="stat-label">总大小</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 搜索和工具栏 -->
    <el-card shadow="never" class="toolbar-card">
      <div class="toolbar-content">
        <el-input v-model="searchKeyword" placeholder="搜索文件名..." clearable @input="handleSearch" class="search-input">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>

        <el-button type="primary" @click="refreshData" :loading="loading" size="large">
          <el-icon>
            <Refresh />
          </el-icon>
          {{ loading ? '加载中...' : '刷新' }}
        </el-button>
      </div>
    </el-card>

    <!-- 文件列表 -->
    <el-card shadow="never" class="file-list-card">
      <template v-if="loading">
        <!-- 加载状态 -->
        <div class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
      </template>

      <template v-else-if="fileList.length > 0">
        <div class="table-wrapper">
          <el-table :data="filteredFiles" style="width: 100%" stripe border size="large" v-loading="tableLoading"
            element-loading-text="加载中..." element-loading-background="rgba(255, 255, 255, 0.8)"
            :cell-style="{ textOverflow: 'ellipsis', overflow: 'hidden' }">
            <el-table-column prop="file_name" label="文件名" align="center" sortable>
              <template #default="scope">
                <div class="file-info">
                  <el-icon :class="getFileTypeClass(scope.row.file_name)" class="file-icon">
                    <Document />
                  </el-icon>
                  <div class="file-details">
                    <div class="file-name" :title="formatFileName(scope.row.file_name)">
                      {{ formatFileName(scope.row.file_name) }}
                    </div>
                    <div class="file-meta">
                      <el-tag size="small" type="info" class="file-type-tag">
                        {{ getFileExtension(scope.row.file_name) }}
                      </el-tag>
                      <span class="file-size">{{ formatFileSize(scope.row.size) }}</span>
                      <span class="file-time">{{ formatDateTime(scope.row.create_time) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="size" label="大小" sortable align="center">
              <template #default="scope">
                <span class="file-size-cell">{{ formatFileSize(scope.row.size) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="create_time" label="上传时间" sortable align="center">
              <template #default="scope">
                <span class="file-time-cell">{{ formatDateTime(scope.row.create_time) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="preview_support" label="预览支持" align="center" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.is_preview" type="success" size="large" effect="dark">支持</el-tag>
                <el-tag v-else type="info" size="large" effect="plain">不支持</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template #default="scope">
                <div class="action-buttons">

                  <el-button round size="default" type="primary" @click="handleDownload(scope.row)"
                    :loading="downloadingFile === scope.row.file_name">
                    <template #icon>
                      <el-icon>
                        <Download />
                      </el-icon>
                    </template>
                    {{ downloadingFile === scope.row.file_name ? '下载中' : '下载' }}
                  </el-button>
                  <el-button round size="default" type="danger" @click="handleDelete(scope.row)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
                  </el-button>
                  <el-button round :disabled="!scope.row.is_preview" size="default" type="info" @click="handlePreview(scope.row)">
                    <template #icon>
                      <el-icon>
                        <View />
                      </el-icon>
                    </template>
                    预览
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalFiles"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" class="pagination"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </template>

      <template v-else>
        <el-empty description="暂无文件，请先上传文件">
          <template #image>
            <el-icon size="60">
              <Folder />
            </el-icon>
          </template>
          <el-button type="primary" @click="handleUpload">上传文件</el-button>
        </el-empty>
      </template>
    </el-card>
    <el-dialog v-model="previewVisible" :title="previewTitle" width="80%" :close-on-click-modal="true" destroy-on-close>
      <div class="preview-container">
        <div v-html="previewContent" v-if="isHtmlContent"></div>
        <iframe v-else :src="previewUrl" class="preview-frame" width="100%" height="600px" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search,
  Download,
  Delete,
  Refresh,
  Document,
  Folder,
  View
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
import http from '@/utils'
import { useRouter } from 'vue-router'
// import { is } from 'core-js/core/object'

const router = useRouter()

// 响应式数据
const fileList = ref([])
const allFileList = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalFiles = ref(0)
const totalSize = ref(0)
const loading = ref(false)
const tableLoading = ref(false)
const downloadingFile = ref('')

let debounceTimer = null

const fileTypeMap = computed(() => {
  return {
    pdf: 'file-pdf',
    doc: 'file-word', docx: 'file-word',
    xls: 'file-excel', xlsx: 'file-excel',
    ppt: 'file-ppt', pptx: 'file-ppt',
    jpg: 'file-image', jpeg: 'file-image', png: 'file-image', gif: 'file-image', webp: 'file-image', svg: 'file-image',
    mp4: 'file-video', avi: 'file-video', mov: 'file-video', mkv: 'file-video',
    mp3: 'file-audio', wav: 'file-audio', flac: 'file-audio', aac: 'file-audio',
    zip: 'file-zip', rar: 'file-zip', '7z': 'file-zip', tar: 'file-zip', gz: 'file-zip',
    js: 'file-code', ts: 'file-code', vue: 'file-code', python: 'file-code', py: 'file-code',
    java: 'file-code', c: 'file-code', cpp: 'file-code', go: 'file-code', rust: 'file-code',
    html: 'file-code', css: 'file-code', json: 'file-code', xml: 'file-code',
    txt: 'file-txt', md: 'file-txt', log: 'file-txt'
  }
})

const previewVisible = ref(false)
const previewUrl = ref('')
const previewTitle = ref('')
const previewContent = ref('')
const isHtmlContent = ref(false)

// 计算属性
const filteredFiles = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    return fileList.value
  }
  return allFileList.value.filter(file =>
    formatFileName(file.file_name)?.toLowerCase().includes(keyword)
  )
})

// 防抖搜索
function debounce(fn, delay = 500) {
  return function (...args) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fn.apply(this, args), delay)
  }
}

const handleSearch = debounce(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    // 搜索时获取所有文件
    getAllFilesForSearch()
  } else {
    // 清空搜索时重新获取分页数据
    getFilesList()
  }
}, 300)

// 辅助函数：处理API响应
function processApiResponse(res) {
  console.log('原始API响应:', res)

  if (!res) {
    return { data: [], total: 0, totalSize: 0 }
  }

  if (res.code !== 200) {
    console.warn('API返回非200状态码:', res.code, res.message)
    return { data: [], total: 0, totalSize: 0 }
  }

  // 处理不同的数据结构
  if (Array.isArray(res.data)) {
    console.log('检测到 data 是数组格式')
    return {
      data: res.data,
      total: res.data.length,
      totalSize: res.data.reduce((sum, file) => sum + (file.size || 0), 0)
    }
  } else if (res.data && Array.isArray(res.data.files)) {
    console.log('检测到 data.files 格式')
    return {
      data: res.data.files,
      total: res.data.total || res.data.files.length,
      totalSize: res.data.totalSize ||
        res.data.files.reduce((sum, file) => sum + (file.size || 0), 0)
    }
  } else if (res.data && Array.isArray(res.data.data)) {
    console.log('检测到 data.data 格式')
    return {
      data: res.data.data,
      total: res.data.total || res.data.data.length,
      totalSize: res.data.totalSize ||
        res.data.data.reduce((sum, file) => sum + (file.size || 0), 0)
    }
  } else {
    console.warn('无法识别的数据结构:', res.data)
    return { data: [], total: 0, totalSize: 0 }
  }
}

// 获取分页文件列表
async function getFilesList() {
  try {
    tableLoading.value = true
    const res = await http.get('/file/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })

    const processed = processApiResponse(res)
    fileList.value = processed.data
    allFileList.value = processed.data
    totalFiles.value = processed.total
    totalSize.value = processed.totalSize

    console.log('处理后的数据:', {
      fileList: fileList.value,
      totalFiles: totalFiles.value,
      totalSize: totalSize.value
    })

  } catch (error) {
    console.error('获取文件列表失败:', error)
    ElMessage.error('获取文件列表失败')
    fileList.value = []
    allFileList.value = []
    totalFiles.value = 0
    totalSize.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 搜索时获取所有文件
async function getAllFilesForSearch() {
  try {
    const res = await http.get('/file/list', {
      params: { page: 1, size: 1000 }  // 搜索时获取较多文件
    })

    if (res.code == 200) {
      if (Array.isArray(res.data)) {
        allFileList.value = res.data || []
      } else if (res.data && Array.isArray(res.data.files)) {
        allFileList.value = res.data.files || []
      } else if (res.data && Array.isArray(res.data.data)) {
        allFileList.value = res.data.data || []
      } else {
        allFileList.value = []
      }
    } else {
      allFileList.value = []
    }
  } catch (error) {
    console.error('搜索文件失败:', error)
    allFileList.value = []
  }
}

// 刷新数据
async function refreshData() {
  try {
    loading.value = true
    await getFilesList()
    ElMessage.success('文件列表已刷新')
  } finally {
    loading.value = false
  }
}

// 格式化文件名，去掉多余空格
function formatFileName(filename) {
  if (!filename) return ''
  return filename.trim()
}

function formatDateTime(timeStr) {
  if (!timeStr) return '-'
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
}

function formatFileSize(size) {
  if (!size || size <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let fileSize = size
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function getFileExtension(filename) {
  if (!filename) return ''
  const ext = filename.slice(filename.lastIndexOf('.') + 1).toUpperCase()
  return ext || '文件'
}

function getFileTypeClass(filename) {
  if (!filename) return ''
  const ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
  return fileTypeMap.value[ext] || 'file-other'
}

async function handlePreview(row) {
  try {
    const response = await http.get('/file/preview', {
      params: { filename: row.file_name }
    })

    if (response.code === 200) {
     const fileExtension = getFileExtension(row.file_name).toLowerCase();
      
      if (['html', 'htm'].includes(fileExtension)) {
        // 对于HTML文件，获取内容并使用v-html渲染
        const contentResponse = await http.get('/file/content', {
          params: { filename: row.file_name }
        });
        
        if (contentResponse.code === 200) {
          previewContent.value = contentResponse.data;
          isHtmlContent.value = true;
          previewUrl.value = '';
        } else {
          previewUrl.value = response.data;
          isHtmlContent.value = false;
        }
      } else {
        previewUrl.value = response.data;
        isHtmlContent.value = false;
      }
      
      previewTitle.value = row.file_name;
      previewVisible.value = true;
    }
  } catch (error) {
    ElMessage.error('预览失败')
  }
}
// 文件操作方法
async function handleDownload(row) {
  try {
    downloadingFile.value = row.file_name

    const response = await http.get('/file/download', {
      params: { filename: row.file_name }
    })

    if (response.code === 200) {
      window.open(response.data, '_blank')

      ElMessage.success('文件下载已开始')
    } else {
      ElMessage.error('下载失败')
    }
  } catch (err) {
    ElMessage.error('下载异常')
  } finally {
    downloadingFile.value = ''
  }
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除文件 "${row.file_name}" 吗？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  }).then(async () => {
    try {
      const res = await http.delete('/file/delete', {
        params: {
          filename: row.file_name,
          miniourl: row.minio_url
        }
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await getFilesList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => { })
}

function handleUpload() {
  router.push('/index/upload')
}

// 分页事件
function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
  getFilesList()
}

function handleCurrentChange(page) {
  currentPage.value = page
  getFilesList()
}


// 监听页面变化
watch([currentPage, pageSize], () => {
  if (!searchKeyword.value) {
    getFilesList()
  }
})

onMounted(() => {
  console.log('开始加载文件列表...')
  getFilesList()
})
</script>

<style scoped>
.file-manager-container {
  height: 100%;
  line-height: 1.4;
  padding: 20px;
  font-size: 100px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  flex: 1;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  padding: 0 4px;
  min-height: 60px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #303133;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.header-stats {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.stat-card {
  min-width: 100px;
  background: #f5f7fa;
  border: none;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  white-space: nowrap;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #606266;
  line-height: 1.2;
}

.toolbar-card {
  background: #f5f7fa;
  border: none;
  flex-shrink: 0;
  margin-bottom: 20px;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.file-list-card {
  font-size: 30px;
  flex: 1;
  border: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  min-width: 0;
}

.loading-container {
  padding: 40px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  min-width: 0;
  min-height: 0;
}

::deep(.el-table .el-scrollbar) {
  line-height: 1.4;
  padding: 8px 0;
  font-size: 20px;
}
.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
  min-width: 0;
}

.file-icon {
  font-size: 20px;
  color: #409eff;
  flex-shrink: 0;
  min-width: 20px;
}

.file-icon.file-pdf {
  color: #e6a23c;
}

.file-icon.file-word {
  color: #409eff;
}

.file-icon.file-excel {
  color: #67c23a;
}

.file-icon.file-ppt {
  color: #f56c6c;
}

.file-icon.file-image {
  color: #9c27b0;
}

.file-icon.file-video {
  color: #ff9800;
}

.file-icon.file-audio {
  color: #00bcd4;
}

.file-icon.file-zip {
  color: #795548;
}

.file-icon.file-code {
  color: #4caf50;
}

.file-icon.file-txt {
  color: #607d8b;
}

.file-icon.file-other {
  color: #909399;
}

.file-details {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.file-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  line-height: 1.4;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  flex-wrap: wrap;
  min-width: 0;
}

.file-type-tag {
  font-size: 10px;
  padding: 0 6px;
  height: 20px;
  line-height: 20px;
  flex-shrink: 0;
  min-width: 40px;
  text-align: center;
}

.file-size,
.file-time {
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.file-size-cell,
.file-time-cell {
  font-size: 20px;
  font-weight: 500;
  color: #606266;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  padding: 10px 0;
  min-width: 0;
}

/* 表格样式优化 */
:deep(.el-table) {
  flex: 1;
  min-height: 0;
  min-width: 0;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
  min-width: 0;
}

:deep(.el-table .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  line-height: 1.4;
  padding: 8px 0;
}

::deep(.el-table th.el-table__cell) {
  background-color: #f8f9fa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

::deep(.el-table .el-table__cell) {
  text-align: center;
}

:deep(.el-table--border .el-table__inner-wrapper::after) {
  display: none;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #ebeef5;
}

.preview-container {
  width: 100%;
  max-height: 70vh;
  overflow: auto;
}
 
.preview-frame {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
/* 响应式调整 */
@media (max-width: 1200px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .file-name {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-input {
    max-width: 100%;
  }

  .file-meta {
    gap: 6px;
  }

  .file-time {
    display: none;
  }

  .file-size,
  .file-time-cell {
    max-width: 80px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>