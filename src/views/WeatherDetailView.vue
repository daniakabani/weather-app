<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherDetail from '../components/organisms/WeatherDetail.vue'
import { useWeatherStore } from '../store/weather'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

const city = ref(route.params.city as string)
const loading = ref(true)
const error = ref<string | null>(null)

// Check if the location exists in the store
const locationExists = computed(() => {
  const locations = Object.keys(weatherStore.locationWeathers)
  return locations.includes(city.value)
})


onMounted(async () => {
  if (!city.value) {
    router.push('/')
    return
  }

  try {
    loading.value = true
    if (locationExists.value) {
      await weatherStore.fetchWeatherForLocation(city.value)
    } else {
      await weatherStore.fetchWeatherDataOnly(city.value)
    }
    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = 'Failed to load weather data. Please try again.'
    console.error(err)
  }
})

const goBack = () => {
  router.push('/')
}

const deleteLocation = async () => {
  if (city.value) {
    const success = weatherStore.removeLocation(city.value)
    if (success) {
      await weatherStore.fetchInitialWeatherData() // Refresh the data
      router.push('/')
    } else {
      error.value = 'Failed to delete location'
    }
  }
}


const addLocation = async () => {
  if (city.value) {
    try {
      const success = await weatherStore.addLocation(city.value)
      if (success) {
        await weatherStore.fetchInitialWeatherData() // Refresh the data
        router.push('/')
      } else {
        error.value = 'Failed to add location'
      }
    } catch (err) {
      error.value = 'Failed to add location'
      console.error(err)
    }
  }
}

</script>

<template>
  <div class="weather-detail">
    <div class="detail-header">
      <button class="back-button" @click="goBack" aria-label="Go back to home">
        <span class="chevron-left">&#8249;</span>
      </button>
      <h1>Weather Details</h1>
      <button
        v-if="locationExists"
        class="delete-button"
        @click="deleteLocation"
        aria-label="Delete location"
      >
        <span class="delete-icon">×</span>
      </button>
      <button
        v-else
        class="add-button"
        @click="addLocation"
        aria-label="Add location"
      >
        <span class="plus-icon">+</span>
      </button>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading weather data...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack">Try Again</button>
    </div>

    <WeatherDetail v-else :city="city" />
  </div>
</template>

<style lang="scss" scoped>
.weather-detail {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  .detail-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      flex-grow: 1;
    }
  }

  .delete-button, .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .delete-button {
    background-color: var(--error-color);

    &:hover {
      background-color: darken(#f44336, 10%);
    }

    .delete-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
  }

  .add-button {
    background-color: var(--primary-color);

    &:hover {
      background-color: darken(#4caf50, 10%);
    }

    .plus-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
  }

  .back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: darken(#4caf50, 10%);
    }

    .chevron-left {
      font-size: 1.5rem;
      line-height: 1;
    }
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #45a049;
      }
    }
  }
}
</style>
