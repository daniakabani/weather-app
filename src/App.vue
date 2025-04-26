<script setup lang="ts">
// App.vue is the root component
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<style lang="scss">
:root {
  --primary-color: #4caf50;
  --secondary-color: #2196f3;
  --text-color: #333;
  --background-color: #f5f5f5;
  --card-background: #fff;
  --border-color: #eee;
  --error-color: #f44336;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #e8e6e3;
    --background-color: #1d2021;
    --card-background: #181a1b;
    --border-color: #383d3f;
  }
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}
</style>
