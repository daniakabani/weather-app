<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '../../store/weather'
import WeatherCard from './WeatherCard.vue'
import ForecastList from './ForecastList.vue'

const props = defineProps<{
  city: string
}>()

const weatherStore = useWeatherStore()

const currentWeather = computed(() => weatherStore.currentWeather)
const forecast = computed(() => weatherStore.forecast)
</script>

<template>
  <div class="weather-detail">
    <h1 class="city-title">Weather for {{ city }}</h1>

    <div v-if="currentWeather && forecast" class="weather-content">
      <WeatherCard :weather="currentWeather" />
      <ForecastList :forecast="forecast" />
    </div>

    <div v-else class="no-data">
      <p>No weather data available for {{ city }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-detail {
  width: 100%;
}

.city-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    background-color: #333;
  }

  p {
    margin: 0;
    font-size: 1.125rem;
    color: #666;

    @media (prefers-color-scheme: dark) {
      color: #ccc;
    }
  }
}
</style>
