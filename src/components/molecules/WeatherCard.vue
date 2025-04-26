<template>
  <div class="weather-card" role="region" aria-label="Weather information">
    <div class="weather-card-header">
      <h3 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h3>
      <p class="time">{{ formattedTime }}</p>
    </div>

    <div class="weather-card-body">
      <div class="temperature-container">
        <img :src="weatherIcon" :alt="weather.weather[0]?.description" class="weather-icon" />
        <div class="temperature-info">
          <p class="temperature">{{ temperatureRounded }}°C</p>
          <p class="weather-description">{{ weather.weather[0]?.description }}</p>
        </div>
      </div>

      <div class="temperature-range">
        <div class="temp-item">
          <span class="temp-label">High:</span>
          <span class="temp-value">{{ Math.round(weather.main.temp_max) }}°C</span>
        </div>
        <div class="temp-item">
          <span class="temp-label">Low:</span>
          <span class="temp-value">{{ Math.round(weather.main.temp_min) }}°C</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '../../types/weather'

const props = defineProps<{
  weather: WeatherData
}>()

const formattedTime = computed(() => {
  const date = new Date(props.weather.dt * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const weatherIcon = computed(() => {
  const iconCode = props.weather.weather[0]?.icon
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
})

const temperatureRounded = computed(() => {
  return Math.round(props.weather.main.temp)
})
</script>

<style lang="scss" scoped>
.weather-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

.weather-card-header {
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;

  .city-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .time {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }
}

.weather-card-body {
  padding: 1rem;
}

.temperature-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  .weather-icon {
    width: 60px;
    height: 60px;
  }

  .temperature-info {
    margin-left: 0.5rem;

    .temperature {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .weather-description {
      margin: 0;
      font-size: 0.875rem;
      text-transform: capitalize;
      color: #666;

      @media (prefers-color-scheme: dark) {
        color: #ccc;
      }
    }
  }
}

.temperature-range {
  display: flex;
  justify-content: space-between;

  .temp-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .temp-label {
      font-size: 0.75rem;
      color: #666;

      @media (prefers-color-scheme: dark) {
        color: #ccc;
      }
    }

    .temp-value {
      font-size: 1rem;
      font-weight: 600;
    }
  }
}

.weather-card-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    border-top-color: #444;
  }

  .details-button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
