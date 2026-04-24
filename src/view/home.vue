<template>
  <div class="project-intro-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎使用云存储</h1>
        <p class="welcome-subtitle">安全、高效、可靠的云端文件管理解决方案</p>
      </div>
      <div class="welcome-illustration">
        <el-icon class="welcome-icon">
          <Cloudy />
        </el-icon>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <el-card class="feature-card" shadow="hover">
          <div class="feature-content">
            <el-icon class="feature-icon upload-feature">
              <Upload />
            </el-icon>
            <h3 class="feature-title">智能上传</h3>
            <p class="feature-desc">支持大文件分片上传，自动秒传，断点续传</p>
            <ul class="feature-list">
              <li>拖拽上传，操作便捷</li>
              <li>实时进度显示</li>
              <li>文件去重处理</li>
            </ul>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover">
          <div class="feature-content">
            <el-icon class="feature-icon manage-feature">
              <Folder />
            </el-icon>
            <h3 class="feature-title">文件管理</h3>
            <p class="feature-desc">强大的文件管理和组织功能</p>
            <ul class="feature-list">
              <li>文件搜索与筛选</li>
              <li>批量操作支持</li>
              <li>详细的文件信息</li>
            </ul>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover">
          <div class="feature-content">
            <el-icon class="feature-icon security-feature">
              <Lock />
            </el-icon>
            <h3 class="feature-title">安全保障</h3>
            <p class="feature-desc">多重安全机制保护您的数据</p>
            <ul class="feature-list">
              <li>MD5校验文件完整性</li>
              <li>安全的访问权限控制</li>
              <li>数据加密存储</li>
            </ul>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="guide-section">
      <h2 class="section-title">快速开始</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">上传文件</h3>
            <p class="step-desc">点击左侧"上传文件"菜单，拖拽文件到上传区域或点击选择文件</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">管理文件</h3>
            <p class="step-desc">在"文件管理"页面查看、搜索、下载或删除您的文件</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">享受云端存储</h3>
            <p class="step-desc">随时随地访问您的文件，安全便捷地进行文件管理</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="tech-section">
      <h2 class="section-title">技术栈</h2>
      <div class="tech-tags">
        <el-tag class="tech-tag" type="primary" size="large">Vue 3</el-tag>
        <el-tag class="tech-tag" type="success" size="large">Element Plus</el-tag>
        <el-tag class="tech-tag" type="warning" size="large">Gin</el-tag>
        <el-tag class="tech-tag" type="danger" size="large">MinIO</el-tag>
        <el-tag class="tech-tag" type="info" size="large">MySQL</el-tag>
        <el-tag class="tech-tag" type="primary" size="large">Redis</el-tag>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <h2 class="section-title">系统优势</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <el-icon class="stat-icon">
            <TrendCharts />
          </el-icon>
          <div class="stat-content">
            <div class="stat-value">高效</div>
            <div class="stat-label">大文件秒传，上传快速稳定</div>
          </div>
        </div>
        <div class="stat-item">
          <el-icon class="stat-icon">
            <DataLine />
          </el-icon>
          <div class="stat-content">
            <div class="stat-value">安全</div>
            <div class="stat-label">多重校验，保障数据安全</div>
          </div>
        </div>
        <div class="stat-item">
          <el-icon class="stat-icon">
            <ScaleToOriginal />
          </el-icon>
          <div class="stat-content">
            <div class="stat-value">易用</div>
            <div class="stat-label">简洁界面，操作简单直观</div>
          </div>
        </div>
        <div class="stat-item">
          <el-icon class="stat-icon">
            <Odometer />
          </el-icon>
          <div class="stat-content">
            <div class="stat-value">稳定</div>
            <div class="stat-label">高可用架构，服务稳定可靠</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开始按钮 -->
    <div class="action-section">
      <el-button 
        type="primary" 
        size="large" 
        class="start-btn" 
        @click="handleStart"
      >
        开始使用
        <el-icon class="start-icon">
          <Right />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  Cloudy, 
  Upload, 
  Folder, 
  Lock, 
  Right,
  TrendCharts,
  DataLine,
  ScaleToOriginal,
  Odometer
} from '@element-plus/icons-vue'

const router = useRouter()

const handleStart = () => {
  router.push('/index/upload')
}
</script>

<style scoped>
.project-intro-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
  animation: fadeInUp 0.8s ease-out;
}

.welcome-content {
  flex: 1;
  min-width: 0;
}

.welcome-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.2;
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
}

.welcome-illustration {
  margin-left: 40px;
  flex-shrink: 0;
}

.welcome-icon {
  font-size: 100px;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

/* 通用部分标题 */
.section-title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 40px 0;
  color: #1e293b;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

/* 功能特性 */
.features-section {
  animation: fadeInUp 1s ease-out 0.2s both;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.feature-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
}

.feature-content {
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-bottom: 24px;
}

.upload-feature {
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(66, 153, 225, 0.2));
  color: #4299e1;
}

.manage-feature {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(72, 187, 120, 0.2));
  color: #48bb78;
}

.security-feature {
  background: linear-gradient(135deg, rgba(237, 100, 166, 0.1), rgba(237, 100, 166, 0.2));
  color: #ed64a6;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #2d3748;
}

.feature-desc {
  color: #718096;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 20px 0;
  min-height: 48px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  width: 100%;
}

.feature-list li {
  padding: 8px 0;
  color: #4a5568;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

/* 使用指南 */
.guide-section {
  animation: fadeInUp 1s ease-out 0.4s both;
}

.guide-steps {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateX(8px);
  }
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2d3748;
}

.step-desc {
  color: #718096;
  line-height: 1.6;
  margin: 0;
  font-size: 15px;
}

/* 技术栈 */
.tech-section {
  animation: fadeInUp 1s ease-out 0.6s both;
  text-align: center;
}

.tech-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.tech-tag {
  font-size: 15px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 统计信息 */
.stats-section {
  animation: fadeInUp 1s ease-out 0.8s both;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.stat-item {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.stat-icon {
  font-size: 40px;
  color: #667eea;
  flex-shrink: 0;
  background: rgba(102, 126, 234, 0.1);
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  color: #718096;
  font-size: 14px;
  line-height: 1.5;
}

/* 开始按钮 */
.action-section {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
  animation: fadeInUp 1s ease-out 1s both;
}

.start-btn {
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
}

.start-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.start-btn:hover .start-icon {
  transform: translateX(4px);
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-intro-container {
    padding: 16px;
    gap: 30px;
  }
  
  .welcome-banner {
    padding: 30px 20px;
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
  }
  
  .welcome-illustration {
    margin: 20px 0 0 0;
  }
  
  .welcome-icon {
    font-size: 80px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>