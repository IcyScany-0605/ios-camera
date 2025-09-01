<template>
  <div v-if="showIOSHelper" class="ios-helper">
    <div class="helper-content">
      <h3>📱 iOS相机权限设置</h3>
      <p>为了使用相机功能，请在iOS设备上进行以下设置：</p>
      
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>打开设置应用</h4>
            <p>在iOS设备上找到并打开 <strong>设置</strong> 应用</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>找到浏览器设置</h4>
            <p>向下滚动找到 <strong>Safari</strong> 或你正在使用的浏览器</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>允许相机访问</h4>
            <p>点击 <strong>相机</strong> 选项，选择 <strong>允许</strong></p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>刷新页面</h4>
            <p>返回浏览器，刷新页面重试</p>
          </div>
        </div>
      </div>
      
      <div class="ios-tips">
        <h4>💡 iOS使用提示：</h4>
        <ul>
          <li>确保在Safari或支持PWA的浏览器中使用</li>
          <li>首次访问时会弹出权限请求，请选择"允许"</li>
          <li>如果权限被拒绝，需要手动在设置中开启</li>
          <li>建议将应用添加到主屏幕以获得最佳体验</li>
        </ul>
      </div>
      
      <div class="actions">
        <button @click="retryPermission" class="retry-btn">🔄 重试权限</button>
        <button @click="addToHomeScreen" class="home-btn">📱 添加到主屏幕</button>
        <button @click="closeHelper" class="close-btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceType } from '../utils/cameraUtils'

const showIOSHelper = ref(false)
const isIOS = ref(false)

// 检测是否为iOS设备
onMounted(() => {
  isIOS.value = getDeviceType() === 'ios'
})

// 重试权限
const retryPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(track => track.stop())
    showIOSHelper.value = false
    // 触发父组件的权限重试
    emit('permission-retry')
  } catch (error) {
    console.log('权限仍然被拒绝，显示帮助信息')
  }
}

// 添加到主屏幕
const addToHomeScreen = () => {
  if (isIOS.value) {
    // iOS添加到主屏幕的提示
    alert('在Safari中，点击分享按钮，然后选择"添加到主屏幕"')
  } else {
    alert('此功能仅在iOS设备上可用')
  }
}

// 关闭帮助
const closeHelper = () => {
  showIOSHelper.value = false
}

// 显示帮助
const showHelper = () => {
  showIOSHelper.value = true
}

// 暴露方法给父组件
defineExpose({
  showHelper
})

// 定义事件
const emit = defineEmits(['permission-retry'])
</script>

<style scoped>
.ios-helper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.helper-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.helper-content h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.helper-content p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.steps {
  margin-bottom: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  text-align: left;
}

.step-number {
  background: #007bff;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.step-content h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.step-content p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.ios-tips {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.ios-tips h4 {
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.ios-tips ul {
  color: #666;
  margin: 0;
  padding-left: 1.5rem;
}

.ios-tips li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-btn,
.home-btn,
.close-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.retry-btn {
  background: #28a745;
  color: white;
}

.retry-btn:hover {
  background: #218838;
}

.home-btn {
  background: #17a2b8;
  color: white;
}

.home-btn:hover {
  background: #138496;
}

.close-btn {
  background: #6c757d;
  color: white;
}

.close-btn:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .helper-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .step {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style> 