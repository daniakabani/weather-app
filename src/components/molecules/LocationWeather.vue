<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../../store/weather'
import Button from '../atoms/Button.vue'

const router = useRouter()
const weatherStore = useWeatherStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const locationSupported = ref(!!navigator.geolocation)

// Check if local weather is already displayed
const hasLocalWeather = computed(() => {
  // Get all location weathers from the store
  const locations = Object.keys(weatherStore.locationWeathers)

  // Check if any of the locations is from the current location
  // We can check this by looking for a location that isn't London or Paris
  return locations.some(city => city !== 'London' && city !== 'Paris')
})

const getLocation = () => {
  if (!locationSupported.value) {
    error.value = 'Geolocation is not supported by your browser'
    return
  }

  isLoading.value = true
  error.value = null

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords

        // Use the weather API to get weather by coordinates
        // This will be implemented in the weatherApi.ts file
        const weatherData = await weatherStore.fetchWeatherByCoordinates(latitude, longitude)

        // Navigate to the weather detail page for the detected city
        if (weatherData && weatherData.name) {
          router.push({
            name: 'WeatherDetail',
            params: { city: weatherData.name }
          })
        }

        isLoading.value = false
      } catch (err) {
        console.error('Error getting weather for location:', err)
        error.value = 'Failed to get weather for your location'
        isLoading.value = false
      }
    },
    (err) => {
      console.error('Geolocation error:', err)
      error.value = getGeolocationErrorMessage(err)
      isLoading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please enable location services.'
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.'
    case error.TIMEOUT:
      return 'The request to get your location timed out.'
    default:
      return 'An unknown error occurred while getting your location.'
  }
}
</script>

<template>
  <div v-if="!hasLocalWeather" class="location-weather">
    <h3>Get weather for your current location</h3>

    <div v-if="!locationSupported" class="error-message">
      <p>Geolocation is not supported by your browser.</p>
    </div>

    <div v-else>
      <Button
        @click="getLocation"
        :disabled="isLoading"
        variant="secondary"
        class="location-button"
      >
        <span v-if="isLoading">Getting location...</span>
        <span v-else>Use My Location</span>
      </Button>

      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.location-weather {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  .location-button {
    min-width: 200px;
  }

  .error-message {
    margin-top: 1rem;
    color: var(--error-color);
    font-size: 0.875rem;
  }
}
</style>
