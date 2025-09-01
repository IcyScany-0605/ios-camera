<template>
  <div class="camera-container">
    <div class="camera-header">
      <h2>📷 相机</h2>
      <div class="device-info">
        <span class="device-badge">{{ deviceType }}</span>
        <span v-if="cameraInfo" class="resolution-badge">
          {{ cameraInfo.currentResolution.width }}×{{
            cameraInfo.currentResolution.height
          }}
        </span>
      </div>
      <div class="camera-controls">
        <button
          @click="switchCamera"
          class="control-btn"
          :disabled="!isStreamActive"
        >
          🔄 切换相机
        </button>
        <button
          @click="toggleFlash"
          class="control-btn"
          :disabled="!isStreamActive"
        >
          {{ flashOn ? '💡 关闭闪光灯' : '💡 开启闪光灯' }}
        </button>
        <button @click="showSettings = !showSettings" class="control-btn">
          ⚙️ 设置
        </button>
      </div>
    </div>

    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <h3>相机设置</h3>
      <div class="settings-grid">
        <div class="setting-item">
          <label>视频质量:</label>
          <select v-model="videoQuality" @change="updateVideoQuality">
            <option value="low">低质量 (720p)</option>
            <option value="medium">中等质量 (1080p)</option>
            <option value="high">高质量 (4K)</option>
          </select>
        </div>
        <div class="setting-item">
          <label>音频录制:</label>
          <input
            type="checkbox"
            v-model="enableAudio"
            @change="updateAudioSetting"
          />
        </div>
        <div class="setting-item">
          <label>自动保存:</label>
          <input type="checkbox" v-model="autoSave" />
        </div>
      </div>
    </div>

    <div class="camera-view">
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="camera-video"
        :class="{ mirrored: isFrontCamera }"
      ></video>

      <div v-if="!isStreamActive" class="camera-placeholder">
        <div class="placeholder-content">
          <div class="camera-icon">📷</div>
          <p>点击下方按钮启动相机</p>
          <button @click="startCamera" class="start-btn">启动相机</button>
        </div>
      </div>

      <div v-if="isStreamActive" class="camera-overlay">
        <div class="recording-indicator" v-if="isRecording">
          <div class="recording-dot"></div>
          <span>录制中... {{ recordingTime }}</span>
        </div>

        <div class="camera-grid">
          <div class="grid-line horizontal"></div>
          <div class="grid-line horizontal"></div>
          <div class="grid-line vertical"></div>
          <div class="grid-line vertical"></div>
        </div>

        <div class="camera-stats">
          <span>FPS: {{ fps }}</span>
          <span>延迟: {{ latency }}ms</span>
        </div>
      </div>
    </div>

    <div class="camera-actions">
      <div class="mode-switch">
        <button
          @click="setMode('photo')"
          class="mode-btn"
          :class="{ active: mode === 'photo' }"
        >
          📸 拍照
        </button>
        <button
          @click="setMode('video')"
          class="mode-btn"
          :class="{ active: mode === 'video' }"
        >
          🎥 录像
        </button>
        <button
          @click="setMode('burst')"
          class="mode-btn"
          :class="{ active: mode === 'burst' }"
        >
          🔥 连拍
        </button>
      </div>

      <div class="capture-controls">
        <button
          v-if="mode === 'photo'"
          @click="takePhoto"
          class="capture-btn photo-btn"
          :disabled="!isStreamActive"
        >
          📸
        </button>

        <button
          v-if="mode === 'video'"
          @click="toggleRecording"
          class="capture-btn video-btn"
          :class="{ recording: isRecording }"
          :disabled="!isStreamActive"
        >
          {{ isRecording ? '⏹️' : '🎥' }}
        </button>

        <button
          v-if="mode === 'burst'"
          @click="startBurstMode"
          class="capture-btn burst-btn"
          :class="{ active: isBurstMode }"
          :disabled="!isStreamActive"
        >
          🔥
        </button>
      </div>
    </div>

    <!-- 预览区域 -->
    <div v-if="capturedMedia.length > 0" class="media-preview">
      <div class="preview-header">
        <h3>已拍摄内容 ({{ capturedMedia.length }})</h3>
        <div class="preview-actions">
          <button @click="downloadAll" class="action-btn">📥 下载全部</button>
          <button @click="clearAll" class="action-btn danger">
            🗑️ 清空全部
          </button>
        </div>
      </div>
      <div class="media-grid">
        <div
          v-for="(media, index) in capturedMedia"
          :key="index"
          class="media-item"
        >
          <img
            v-if="media.type === 'photo'"
            :src="media.url"
            :alt="`照片 ${index + 1}`"
            @click="previewMedia(media)"
          />
          <video
            v-else
            :src="media.url"
            controls
            @click="previewMedia(media)"
          ></video>
          <div class="media-info">
            <span class="media-type">{{
              media.type === 'photo' ? '📸' : '🎥'
            }}</span>
            <span class="media-time">{{ formatTime(media.timestamp) }}</span>
          </div>
          <button @click="deleteMedia(index)" class="delete-btn">🗑️</button>
        </div>
      </div>
    </div>

    <!-- 权限提示 -->
    <div v-if="permissionError" class="permission-error">
      <h3>⚠️ 相机权限被拒绝</h3>
      <p>{{ permissionErrorMessage }}</p>
      <div class="error-actions">
        <button @click="requestPermission" class="retry-btn">重试</button>
        <button @click="showPermissionHelp" class="help-btn">查看帮助</button>
      </div>
    </div>

    <!-- 帮助模态框 -->
    <div v-if="showHelp" class="help-modal">
      <div class="help-content">
        <h3>📱 相机权限设置</h3>
        <ol>
          <li>打开浏览器设置</li>
          <li>找到相机权限设置</li>
          <li>选择允许访问</li>
          <li>刷新页面重试</li>
        </ol>
        <button @click="showHelp = false" class="close-btn">关闭</button>
      </div>
    </div>

    <!-- iOS相机助手 -->
    <IOSCameraHelper ref="iosHelperRef" @permission-retry="requestPermission" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  isCameraSupported,
  getDeviceType,
  requestCameraPermission,
  getCameraCapabilities,
  createMediaRecorder,
  saveMediaFile,
  compressImage,
} from '../utils/cameraUtils'
import IOSCameraHelper from './IOSCameraHelper.vue'

// 响应式数据
const videoRef = ref(null)
const isStreamActive = ref(false)
const isRecording = ref(false)
const isFrontCamera = ref(false)
const isBurstMode = ref(false)
const flashOn = ref(false)
const mode = ref('photo')
const capturedMedia = ref([])
const permissionError = ref(false)
const permissionErrorMessage = ref('')
const showSettings = ref(false)
const showHelp = ref(false)
const deviceType = ref('unknown')
const cameraInfo = ref(null)
const videoQuality = ref('medium')
const enableAudio = ref(false)
const autoSave = ref(true)
const recordingTime = ref('00:00')
const fps = ref(0)
const latency = ref(0)

// 媒体流和录制器
let mediaStream = null
let mediaRecorder = null
let recordedChunks = []
let recordingInterval = null
let fpsInterval = null
let burstInterval = null

// 计算属性
const isSupported = computed(() => isCameraSupported())

// 启动相机
const startCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: isFrontCamera.value ? 'user' : 'environment',
        width: { ideal: getQualityWidth() },
        height: { ideal: getQualityHeight() },
      },
      audio: enableAudio.value,
    }

    const result = await requestCameraPermission(constraints)

    if (result.success) {
      mediaStream = result.stream

      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream
        isStreamActive.value = true
        permissionError.value = false

        // 获取相机信息
        cameraInfo.value = await getCameraCapabilities(mediaStream)

        // 启动FPS监控
        startFPSMonitoring()
      }
    } else {
      permissionError.value = true
      permissionErrorMessage.value = result.message
    }
  } catch (error) {
    console.error('相机启动失败:', error)
    permissionError.value = true
    permissionErrorMessage.value = '相机启动失败，请检查设备权限'
  }
}

// 获取质量对应的分辨率
const getQualityWidth = () => {
  switch (videoQuality.value) {
    case 'low':
      return 1280
    case 'high':
      return 3840
    default:
      return 1920
  }
}

const getQualityHeight = () => {
  switch (videoQuality.value) {
    case 'low':
      return 720
    case 'high':
      return 2160
    default:
      return 1080
  }
}

// 更新视频质量
const updateVideoQuality = () => {
  if (isStreamActive.value) {
    stopCamera()
    startCamera()
  }
}

// 更新音频设置
const updateAudioSetting = () => {
  if (isStreamActive.value) {
    stopCamera()
    startCamera()
  }
}

// 启动FPS监控
const startFPSMonitoring = () => {
  let frameCount = 0
  let lastTime = performance.now()

  fpsInterval = setInterval(() => {
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTime

    if (deltaTime > 0) {
      fps.value = Math.round((frameCount * 1000) / deltaTime)
    }

    frameCount = 0
    lastTime = currentTime
  }, 1000)
}

// 停止相机
const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  isStreamActive.value = false
  isRecording.value = false
  isBurstMode.value = false

  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }

  if (fpsInterval) {
    clearInterval(fpsInterval)
    fpsInterval = null
  }

  if (burstInterval) {
    clearInterval(burstInterval)
    burstInterval = null
  }
}

// 切换前后相机
const switchCamera = async () => {
  isFrontCamera.value = !isFrontCamera.value
  if (isStreamActive.value) {
    stopCamera()
    await startCamera()
  }
}

// 切换闪光灯
const toggleFlash = () => {
  flashOn.value = !flashOn.value
  // 注意：移动设备上闪光灯控制需要特殊权限
}

// 设置模式
const setMode = newMode => {
  mode.value = newMode
  if (isStreamActive.value && newMode === 'video') {
    stopCamera()
    startCamera()
  }
}

// 拍照
const takePhoto = async () => {
  if (!isStreamActive.value) return

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const video = videoRef.value

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // 如果是前置摄像头，水平翻转
  if (isFrontCamera.value) {
    context.scale(-1, 1)
    context.translate(-canvas.width, 0)
  }

  context.drawImage(video, 0, 0)
  let photoUrl = canvas.toDataURL('image/jpeg', 0.9)

  // 压缩图片
  if (autoSave.value) {
    photoUrl = await compressImage(photoUrl, 0.8, 1920)
  }

  const media = {
    type: 'photo',
    url: photoUrl,
    timestamp: new Date().toISOString(),
  }

  capturedMedia.value.push(media)

  // 自动保存
  if (autoSave.value) {
    const filename = `photo_${Date.now()}.jpg`
    const blob = await dataURLToBlob(photoUrl)
    saveMediaFile(blob, filename)
  }
}

// 开始/停止录像
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 开始录像
const startRecording = () => {
  if (!mediaStream) return

  recordedChunks = []
  mediaRecorder = createMediaRecorder(mediaStream, {
    audio: enableAudio.value,
  })

  if (!mediaRecorder) {
    alert('不支持视频录制')
    return
  }

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType })
    const videoUrl = URL.createObjectURL(blob)

    const media = {
      type: 'video',
      url: videoUrl,
      timestamp: new Date().toISOString(),
    }

    capturedMedia.value.push(media)

    // 自动保存
    if (autoSave.value) {
      const filename = `video_${Date.now()}.webm`
      saveMediaFile(blob, filename)
    }
  }

  mediaRecorder.start()
  isRecording.value = true

  // 开始计时
  let seconds = 0
  recordingInterval = setInterval(() => {
    seconds++
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    recordingTime.value = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, 1000)
}

// 停止录像
const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false

    if (recordingInterval) {
      clearInterval(recordingInterval)
      recordingInterval = null
      recordingTime.value = '00:00'
    }
  }
}

// 连拍模式
const startBurstMode = () => {
  if (isBurstMode.value) {
    isBurstMode.value = false
    if (burstInterval) {
      clearInterval(burstInterval)
      burstInterval = null
    }
  } else {
    isBurstMode.value = true
    burstInterval = setInterval(() => {
      if (isBurstMode.value) {
        takePhoto()
      }
    }, 200) // 每200ms拍一张
  }
}

// 预览媒体
const previewMedia = media => {
  // 可以在这里实现全屏预览
  console.log('预览媒体:', media)
}

// 删除媒体
const deleteMedia = index => {
  const media = capturedMedia.value[index]
  if (media.type === 'video') {
    URL.revokeObjectURL(media.url)
  }
  capturedMedia.value.splice(index, 1)
}

// 下载全部
const downloadAll = async () => {
  for (let i = 0; i < capturedMedia.value.length; i++) {
    const media = capturedMedia.value[i]
    const filename = `${media.type}_${i + 1}_${Date.now()}.${media.type === 'photo' ? 'jpg' : 'webm'}`

    if (media.type === 'photo') {
      const blob = await dataURLToBlob(media.url)
      saveMediaFile(blob, filename)
    } else {
      // 视频文件已经是blob，直接下载
      const response = await fetch(media.url)
      const blob = await response.blob()
      saveMediaFile(blob, filename)
    }
  }
}

// 清空全部
const clearAll = () => {
  if (confirm('确定要清空所有拍摄内容吗？')) {
    capturedMedia.value.forEach(media => {
      if (media.type === 'video') {
        URL.revokeObjectURL(media.url)
      }
    })
    capturedMedia.value = []
  }
}

// 格式化时间
const formatTime = timestamp => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// 请求权限
const requestPermission = () => {
  permissionError.value = false
  startCamera()
}

// 显示权限帮助
const showPermissionHelp = () => {
  if (deviceType.value === 'ios') {
    iosHelperRef.value?.showHelper()
  } else {
    showHelp.value = true
  }
}

// 工具函数：将dataURL转换为blob
const dataURLToBlob = dataURL => {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// 添加iOS助手引用
const iosHelperRef = ref(null)

// 生命周期
onMounted(() => {
  deviceType.value = getDeviceType()

  if (!isSupported.value) {
    alert('您的设备不支持相机功能')
    return
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.camera-header {
  text-align: center;
  margin-bottom: 1rem;
}

.camera-header h2 {
  margin-bottom: 1rem;
  color: #333;
}

.device-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.device-badge,
.resolution-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.camera-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.control-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.control-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.settings-panel {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-panel h3 {
  margin-bottom: 1rem;
  color: #333;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  font-weight: 500;
  color: #555;
}

.setting-item select,
.setting-item input[type='checkbox'] {
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.camera-view {
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  aspect-ratio: 16/9;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-video.mirrored {
  transform: scaleX(-1);
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  color: white;
}

.placeholder-content {
  text-align: center;
}

.camera-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.start-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.recording-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
}

.recording-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.camera-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.grid-line {
  background: rgba(255, 255, 255, 0.3);
}

.grid-line.horizontal {
  height: 1px;
  width: 100%;
}

.grid-line.vertical {
  width: 1px;
  height: 100%;
}

.camera-stats {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
}

.camera-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-switch {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.mode-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.mode-btn.active {
  background: #007bff;
}

.capture-controls {
  display: flex;
  justify-content: center;
}

.capture-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  background: #007bff;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.capture-btn:hover {
  transform: scale(1.05);
}

.capture-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.capture-btn.recording {
  background: #dc3545;
  animation: pulse 1s infinite;
}

.capture-btn.active {
  background: #28a745;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.media-preview {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preview-header h3 {
  color: #333;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn.danger {
  background: #dc3545;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.media-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.media-item img,
.media-item video {
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
}

.media-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1rem;
}

.permission-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  margin-top: 1rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.retry-btn,
.help-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.help-btn {
  background: #6c757d;
}

.help-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.help-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  text-align: center;
}

.help-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.help-content ol {
  text-align: left;
  margin-bottom: 1.5rem;
}

.help-content li {
  margin-bottom: 0.5rem;
  color: #555;
}

.close-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .camera-container {
    padding: 0.5rem;
  }

  .camera-controls {
    flex-direction: column;
    align-items: center;
  }

  .mode-switch {
    flex-direction: column;
    align-items: center;
  }

  .capture-btn {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .preview-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .preview-actions {
    justify-content: center;
  }
}
</style>
