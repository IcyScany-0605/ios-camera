<template>
  <div id="app">
    <header class="header">
      <h1>📷 Camera App</h1>
      <p>基于 Vue 3 + Vite 构建的现代化应用</p>
    </header>

    <nav class="navigation">
      <button
        @click="currentPage = 'home'"
        class="nav-btn"
        :class="{ active: currentPage === 'home' }"
      >
        🏠 首页
      </button>
      <button
        @click="currentPage = 'camera'"
        class="nav-btn"
        :class="{ active: currentPage === 'camera' }"
      >
        📷 相机
      </button>
    </nav>

    <main class="main">
      <!-- 首页内容 -->
      <div v-if="currentPage === 'home'" class="home-content">
        <div class="card">
          <h2>欢迎使用 Vue 3!</h2>
          <p>这是一个使用最新技术栈构建的Vue应用。</p>
          <button @click="count++" class="btn">点击次数: {{ count }}</button>
        </div>

        <div class="features">
          <div class="feature">
            <h3>⚡ Vite</h3>
            <p>极速的开发服务器和构建工具</p>
          </div>
          <div class="feature">
            <h3>🎯 Vue 3</h3>
            <p>渐进式JavaScript框架</p>
          </div>
          <div class="feature">
            <h3>🔧 现代化工具链</h3>
            <p>ESLint + Prettier 代码质量保证</p>
          </div>
        </div>
      </div>

      <!-- 相机页面 -->
      <div v-if="currentPage === 'camera'">
        <Camera />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Camera from './components/Camera.vue'

const count = ref(0)
const currentPage = ref('home')
</script>

<style scoped>
.header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.nav-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #5a6268;
}

.nav-btn.active {
  background: #007bff;
  transform: translateY(-2px);
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-content {
  display: block;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.card h2 {
  color: #333;
  margin-bottom: 1rem;
}

.card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .main {
    padding: 0 0.5rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .navigation {
    flex-direction: column;
    align-items: center;
  }
}
</style>
