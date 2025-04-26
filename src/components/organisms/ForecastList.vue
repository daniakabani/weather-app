<script setup lang="ts">
import { computed } from 'vue'
import type { ForecastData } from '../../types/weather'

const props = defineProps<{
  forecast: ForecastData
}>()

const dailyForecasts = computed(() => {
  if (!props.forecast || !props.forecast.list) return []

  // Group forecast by day and return the first entry for each day
  const forecastsByDay = props.forecast.list.reduce(
    (acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = item
      }
      return acc
    },
    {} as Record<string, ForecastData['list'][0]>
  )

  return Object.values(forecastsByDay).slice(0, 5) // Return next 5 days
})

const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
</script>

<template>
  <div class="forecast-list" role="region" aria-label="5-day weather forecast">
    <h3 class="forecast-title">5-Day Forecast</h3>

    <div class="forecast-items">
      <div
        v-for="(item, index) in dailyForecasts"
        :key="item.dt"
        class="forecast-item"
        :class="{ 'first-item': index === 0 }"
      >
        <div class="forecast-day">
          <div class="day">{{ formatDay(item.dt) }}</div>
          <div class="date">{{ formatDate(item.dt) }}</div>
        </div>

        <div class="forecast-icon">
          <img :src="getWeatherIcon(item.weather[0]?.icon)" :alt="item.weather[0]?.description" />
        </div>

        <div class="forecast-temp">
          <div class="temp-max">{{ Math.round(item.main.temp_max) }}°</div>
          <div class="temp-min">{{ Math.round(item.main.temp_min) }}°</div>
        </div>

        <div class="forecast-desc">
          {{ item.weather[0]?.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forecast-list {
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.forecast-title {
  padding: 1rem 1.5rem;
  margin: 0;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
  font-size: 1.25rem;

  @media (prefers-color-scheme: dark) {
    background-color: #333;
    border-bottom-color: #444;
  }
}

.forecast-items {
  display: flex;
  flex-direction: column;
}

.forecast-item {
  display: grid;
  grid-template-columns: 1fr 80px 1fr 2fr;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #444;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 60px 1fr 1fr;
  }

  &:last-child {
    border-bottom: none;
  }

  &.first-item {
    background-color: rgba(76, 175, 80, 0.1);
  }
}

.forecast-day {
  .day {
    font-weight: 600;
    font-size: 1rem;
  }

  .date {
    font-size: 0.875rem;
    color: #666;

    @media (prefers-color-scheme: dark) {
      color: #ccc;
    }
  }
}

.forecast-icon {
  display: flex;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
  }
}

.forecast-temp {
  display: flex;
  flex-direction: column;
  align-items: center;

  .temp-max {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .temp-min {
    font-size: 0.875rem;
    color: #666;

    @media (prefers-color-scheme: dark) {
      color: #ccc;
    }
  }
}

.forecast-desc {
  text-transform: capitalize;
  font-size: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
}
</style>
