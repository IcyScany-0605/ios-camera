<template>
  <div class="vue3-knowledge-overlay">
    <div class="knowledge-header">
      <h2>📚 Vue 3 知识库</h2>
      <button @click="closeOverlay" class="close-overlay-btn">✕</button>
    </div>
    
    <div class="knowledge-content">
      <div class="knowledge-section">
        <h3>🎯 Composition API</h3>
        <p>Vue 3 的核心特性，提供更好的逻辑复用和类型推导：</p>
        <ul>
          <li><strong>ref()</strong> - 响应式引用，用于基本类型</li>
          <li><strong>reactive()</strong> - 响应式对象，用于复杂数据结构</li>
          <li><strong>computed()</strong> - 计算属性，自动追踪依赖</li>
          <li><strong>watch()</strong> - 侦听器，响应数据变化</li>
        </ul>
      </div>

      <div class="knowledge-section">
        <h3>⚡ 性能优化</h3>
        <p>Vue 3 相比 Vue 2 的性能提升：</p>
        <ul>
          <li><strong>Tree-shaking</strong> - 按需导入，减少包体积</li>
          <li><strong>Proxy</strong> - 使用 ES6 Proxy 替代 Object.defineProperty</li>
          <li><strong>静态提升</strong> - 编译时优化，减少运行时开销</li>
          <li><strong>Fragment</strong> - 支持多根节点，减少包装元素</li>
        </ul>
      </div>

      <div class="knowledge-section">
        <h3>🔧 新特性</h3>
        <p>Vue 3 引入的新功能和改进：</p>
        <ul>
          <li><strong>Teleport</strong> - 将组件渲染到指定位置</li>
          <li><strong>Suspense</strong> - 异步组件加载状态管理</li>
          <li><strong>Multiple v-model</strong> - 支持多个 v-model 绑定</li>
          <li><strong>Global API 重构</strong> - 更好的 Tree-shaking 支持</li>
        </ul>
      </div>

      <div class="knowledge-section">
        <h3>📱 移动端优化</h3>
        <p>针对移动设备的特殊优化：</p>
        <ul>
          <li><strong>触摸事件</strong> - 更好的触摸支持</li>
          <li><strong>手势识别</strong> - 内置手势处理</li>
          <li><strong>性能监控</strong> - 实时性能指标</li>
          <li><strong>离线支持</strong> - PWA 和 Service Worker 集成</li>
        </ul>
      </div>

      <div class="knowledge-section">
        <h3>🎨 样式系统</h3>
        <p>Vue 3 的样式解决方案：</p>
        <ul>
          <li><strong>CSS Modules</strong> - 局部作用域样式</li>
          <li><strong>CSS Variables</strong> - 动态主题切换</li>
          <li><strong>Scoped Styles</strong> - 组件级样式隔离</li>
          <li><strong>CSS-in-JS</strong> - 运行时样式生成</li>
        </ul>
      </div>

      <div class="knowledge-section">
        <h3>🚀 最佳实践</h3>
        <p>Vue 3 开发的最佳实践建议：</p>
        <ul>
          <li><strong>使用 &lt;script setup&gt;</strong> - 更简洁的组件语法</li>
          <li><strong>组合式函数</strong> - 逻辑复用和测试</li>
          <li><strong>TypeScript 集成</strong> - 更好的类型安全</li>
          <li><strong>性能监控</strong> - 使用 Vue DevTools 分析性能</li>
        </ul>
      </div>
    </div>

    <div class="knowledge-footer">
      <p>💡 提示：相机仍在后台运行，可以随时返回拍摄界面</p>
      <button @click="closeOverlay" class="return-btn">返回拍摄</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['close'])

const closeOverlay = () => {
  emit('close')
}
</script>

<style scoped>
.vue3-knowledge-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 1000;
  overflow-y: auto;
  padding: 1rem;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.knowledge-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.close-overlay-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.close-overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.knowledge-content {
  max-width: 800px;
  margin: 0 auto;
}

.knowledge-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.knowledge-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: #ffd700;
}

.knowledge-section p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  opacity: 0.9;
}

.knowledge-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.knowledge-section li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.knowledge-section strong {
  color: #ffd700;
  font-weight: 600;
}

.knowledge-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
}

.knowledge-footer p {
  margin-bottom: 1rem;
  opacity: 0.8;
  font-style: italic;
}

.return-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.return-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .vue3-knowledge-overlay {
    padding: 0.5rem;
  }
  
  .knowledge-header h2 {
    font-size: 1.5rem;
  }
  
  .knowledge-section {
    padding: 1rem;
  }
  
  .knowledge-section h3 {
    font-size: 1.1rem;
  }
}
</style> 