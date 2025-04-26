<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '../../types/weather'

const props = defineProps<{
  weather: WeatherData
}>()

const formattedDate = computed(() => {
  const date = new Date(props.weather.dt * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

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

const sunriseTime = computed(() => {
  const date = new Date(props.weather.sys.sunrise * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const sunsetTime = computed(() => {
  const date = new Date(props.weather.sys.sunset * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<template>
  <div class="weather-card" role="region" aria-label="Current weather information">
    <div class="weather-card-header">
      <h2 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h2>
      <div class="date-time">
        <p class="date">{{ formattedDate }}</p>
        <p class="time">{{ formattedTime }}</p>
      </div>
    </div>

    <div class="weather-card-body">
      <div class="temperature-container">
        <img :src="weatherIcon" :alt="weather.weather[0]?.description" class="weather-icon" />
        <div class="temperature-info">
          <p class="temperature">{{ temperatureRounded }}°C</p>
          <p class="weather-description">{{ weather.weather[0]?.description }}</p>
        </div>
      </div>

      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Feels like:</span>
          <span class="detail-value">{{ Math.round(weather.main.feels_like) }}°C</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity:</span>
          <span class="detail-value">{{ weather.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind:</span>
          <span class="detail-value">{{ Math.round(weather.wind.speed) }} m/s</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Pressure:</span>
          <span class="detail-value">{{ weather.main.pressure }} hPa</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sunrise:</span>
          <span class="detail-value">{{ sunriseTime }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sunset:</span>
          <span class="detail-value">{{ sunsetTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;

  @media (prefers-color-scheme: dark) {
    background-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.weather-card-header {
  padding: 1.5rem;
  background-color: #4caf50;
  color: white;

  .city-name {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .date-time {
    margin-top: 0.5rem;
    font-size: 0.875rem;

    .date,
    .time {
      margin: 0;
    }
  }
}

.weather-card-body {
  padding: 1.5rem;
}

.temperature-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  .weather-icon {
    width: 80px;
    height: 80px;
  }

  .temperature-info {
    margin-left: 1rem;

    .temperature {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
    }

    .weather-description {
      margin: 0;
      font-size: 1rem;
      text-transform: capitalize;
      color: #666;

      @media (prefers-color-scheme: dark) {
        color: #ccc;
      }
    }
  }
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;

    @media (prefers-color-scheme: dark) {
      border-bottom-color: #444;
    }

    .detail-label {
      color: #666;

      @media (prefers-color-scheme: dark) {
        color: #ccc;
      }
    }

    .detail-value {
      font-weight: 500;
    }
  }
}
</style>
