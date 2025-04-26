<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'

const router = useRouter()
const city = ref('')
const error = ref<string | null>(null)

const validateCity = (): boolean => {
  if (!city.value.trim()) {
    error.value = 'Please enter a city name'
    return false
  }

  // Check if city contains only letters, spaces, and hyphens
  const cityRegex = /^[a-zA-Z\s-]+$/
  if (!cityRegex.test(city.value)) {
    error.value = 'City name can only contain letters, spaces, and hyphens'
    return false
  }

  error.value = null
  return true
}

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (validateCity()) {
    // Instead of emitting an event, redirect to the search page
    router.push({ name: 'Search' })
  }
}

const handleInputClick = () => {
  // Redirect to search page when the input is clicked
  router.push({ name: 'Search' })
}
</script>

<template>
  <form @submit="handleSubmit" class="search-form" aria-label="Search for a city">
    <div class="search-container">
      <Input
        v-model="city"
        placeholder="Enter city name"
        label="City"
        required
        :error="error"
        aria-label="City name"
        @click="handleInputClick"
      />

      <Button type="submit" variant="primary" class="search-button"> Search </Button>
    </div>

    <p class="search-hint">Click to search for a city or location</p>
  </form>
</template>

<style lang="scss" scoped>
.search-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.search-button {
  align-self: flex-end;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    width: 100%;
  }
}

.search-hint {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
