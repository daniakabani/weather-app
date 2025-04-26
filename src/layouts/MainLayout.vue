<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()

const goToProfile = () => {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Weather App</h1>
        <div class="profile-section" @click="goToProfile">
          <div class="profile-info">
            <span class="profile-name">{{ userStore.fullName }}</span>
          </div>
          <div class="profile-avatar">
            <img :src="userStore.profile.profilePicture" alt="Profile" />
          </div>
        </div>
      </div>
    </header>

    <main class="app-content">
      <slot></slot>
    </main>

    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} Weather App. Powered by OpenWeatherMap.</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--card-background);
  color: var(--text-color);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 100%;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
}

.profile-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 2rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
}

.profile-info {
  margin-right: 0.75rem;

  @media (max-width: 600px) {
    display: none;
  }
}

.profile-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.profile-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.app-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: var(--card-background);
  color: var(--text-color);
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
}
</style>
