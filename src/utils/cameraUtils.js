// 检查设备是否支持相机
export const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// 检查设备类型
export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase()

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  } else if (/windows|mac|linux/.test(userAgent)) {
    return 'desktop'
  }

  return 'unknown'
}

// 获取相机权限
export const requestCameraPermission = async (constraints = {}) => {
  try {
    const defaultConstraints = {
      video: {
        facingMode: 'environment', // 默认使用后置摄像头
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    }

    const finalConstraints = {
      ...defaultConstraints,
      ...constraints,
    }

    const stream = await navigator.mediaDevices.getUserMedia(finalConstraints)
    return { success: true, stream }
  } catch (error) {
    console.error('相机权限请求失败:', error)

    let errorMessage = '相机启动失败'

    switch (error.name) {
      case 'NotAllowedError':
        errorMessage = '相机权限被拒绝，请在浏览器设置中允许访问相机'
        break
      case 'NotFoundError':
        errorMessage = '未找到相机设备'
        break
      case 'NotReadableError':
        errorMessage = '相机被其他应用占用'
        break
      case 'OverconstrainedError':
        errorMessage = '相机不满足要求'
        break
      case 'TypeError':
        errorMessage = '相机参数错误'
        break
      default:
        errorMessage = `相机错误: ${error.message}`
    }

    return {
      success: false,
      error: error.name,
      message: errorMessage,
    }
  }
}

// 获取可用的相机设备列表
export const getCameraDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(device => device.kind === 'videoinput')
  } catch (error) {
    console.error('获取相机设备列表失败:', error)
    return []
  }
}

// 检查是否支持特定视频格式
export const isVideoFormatSupported = mimeType => {
  return MediaRecorder.isTypeSupported(mimeType)
}

// 获取最佳视频录制格式
export const getBestVideoFormat = () => {
  const formats = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
    'video/ogg;codecs=theora',
  ]

  for (const format of formats) {
    if (isVideoFormatSupported(format)) {
      return format
    }
  }

  return null
}

// 创建媒体录制器
export const createMediaRecorder = (stream, options = {}) => {
  const defaultOptions = {
    mimeType: getBestVideoFormat(),
    videoBitsPerSecond: 2500000, // 2.5 Mbps
    audioBitsPerSecond: 128000, // 128 kbps
  }

  const finalOptions = { ...defaultOptions, ...options }

  try {
    return new MediaRecorder(stream, finalOptions)
  } catch (error) {
    console.error('创建媒体录制器失败:', error)
    return null
  }
}

// 保存媒体文件
export const saveMediaFile = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 压缩图片
export const compressImage = (dataUrl, quality = 0.8, maxWidth = 1920) => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 计算新的尺寸
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    img.src = dataUrl
  })
}

// 获取相机分辨率信息
export const getCameraCapabilities = async stream => {
  try {
    const videoTrack = stream.getVideoTracks()[0]
    const capabilities = videoTrack.getCapabilities()
    const settings = videoTrack.getSettings()

    return {
      capabilities,
      settings,
      currentResolution: {
        width: settings.width,
        height: settings.height,
      },
    }
  } catch (error) {
    console.error('获取相机能力失败:', error)
    return null
  }
}
