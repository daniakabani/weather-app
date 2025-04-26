<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchForm from '../components/molecules/SearchForm.vue'
import LocationWeather from '../components/molecules/LocationWeather.vue'
import WeatherCard from '../components/molecules/WeatherCard.vue'
import { useWeatherStore } from '../store/weather'

const router = useRouter()
const weatherStore = useWeatherStore()

const isLoading = ref(true)
const error = ref<string | null>(null)

// Load initial weather data when component mounts
onMounted(async () => {
  try {
    isLoading.value = true
    await weatherStore.fetchInitialWeatherData()
    isLoading.value = false
  } catch (err) {
    console.error('Failed to load initial weather data:', err)
    error.value = 'Failed to load weather data. Please try again.'
    isLoading.value = false
  }
})

// Get all location weathers from the store
const locationWeathers = computed(() => {
  // Create a new object to ensure reactivity
  return { ...weatherStore.locationWeathers }
})


// Convert the locationWeathers object to an array for v-for
const weatherLocations = computed(() => {
  // Recompute when locationWeathers changes
  return Object.entries({ ...locationWeathers.value }).map(([city, data]) => ({
    city,
    ...data
  }))
})


// Sort weather locations to ensure current location is first
const sortedWeatherLocations = computed(() => {
  return weatherLocations.value.sort((a, b) => {
    // Current location is any location that is not London or Paris
    const isCurrentLocationA = a.city !== 'London' && a.city !== 'Paris'
    const isCurrentLocationB = b.city !== 'London' && b.city !== 'Paris'

    if (isCurrentLocationA && !isCurrentLocationB) return -1
    if (!isCurrentLocationA && isCurrentLocationB) return 1
    return 0
  })
})

// Filter out cities that already exist in location weathers from recent searches
const recentSearches = computed(() => {
  return weatherStore.recentSearches.filter(city => !Object.keys(weatherStore.locationWeathers).includes(city))
})

const handleRecentSearch = (city: string) => {
  router.push({ name: 'WeatherDetail', params: { city } })
}

const handleCardClick = (city: string) => {
  router.push({ name: 'WeatherDetail', params: { city } })
}
</script>

<template>
  <div class="home">
    <h1>Weather App</h1>

    <div class="search-container">
      <SearchForm />

      <!-- Recent Searches moved to top -->
      <div v-if="recentSearches.length > 0" class="recent-searches">
        <h3>Recent Searches</h3>
        <ul class="recent-list">
          <li v-for="city in recentSearches" :key="city" class="recent-item">
            <button @click="handleRecentSearch(city)" class="recent-button">
              {{ city }}
            </button>
          </li>
        </ul>
      </div>

      <LocationWeather />
    </div>

    <!-- Weather Cards Section -->
    <div class="weather-cards-section">
      <h2>Current Weather</h2>

      <div v-if="isLoading" class="loading-state">
        <p>Loading weather data...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="weatherStore.fetchInitialWeatherData()" class="retry-button">
          Retry
        </button>
      </div>

      <div v-else-if="weatherLocations.length === 0" class="no-data-state">
        <p>No weather data available</p>
      </div>

      <div v-else class="weather-cards-grid">
        <div
          v-for="location in sortedWeatherLocations"
          :key="location.city"
          class="weather-card-wrapper"
          @click="handleCardClick(location.city)"
        >
          <WeatherCard :weather="location.weather" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 2rem 0 1rem;
    text-align: center;
    width: 100%;
  }
}

.search-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.weather-cards-section {
  width: 100%;
  margin-top: 2rem;
}

.weather-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.weather-card-wrapper {
  display: flex;
  flex-direction: column;
}

.loading-state, .error-state, .no-data-state {
  text-align: center;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;

  p {
    margin: 0 0 1rem;
  }
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: darken(#4caf50, 10%);
  }
}

.recent-searches {
  margin-top: 2rem;
  width: 100%;

  h3 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .recent-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;

    .recent-item {
      .recent-button {
        background-color: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--primary-color);
          color: white;
        }
      }
    }
  }
}
</style>
