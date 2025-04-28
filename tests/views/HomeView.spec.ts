import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../../src/views/HomeView.vue'
import { useWeatherStore } from '../../src/store/weather'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/weather/:city',
      name: 'WeatherDetail',
      component: { template: '<div>Weather Detail</div>' }
    }
  ]
})

// Mock weather data
const mockWeatherData = {
  name: 'London',
  main: {
    temp: 15,
    feels_like: 14,
    temp_min: 13,
    temp_max: 17,
    pressure: 1012,
    humidity: 76
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  wind: {
    speed: 3.6,
    deg: 320
  }
}

describe('HomeView', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)

    // Mock the weather store
    const weatherStore = useWeatherStore()

    // Mock the fetchInitialWeatherData method
    weatherStore.fetchInitialWeatherData = vi.fn().mockResolvedValue(undefined)

    // Set up mock data
    weatherStore.locationWeathers = {
      'London': {
        weather: mockWeatherData,
        forecast: null,
        timestamp: Date.now()
      }
    }

    weatherStore.recentSearches = ['Paris', 'New York']
  })

  it('renders the home view correctly', async () => {
    render(HomeView, {
      global: {
        plugins: [router]
      }
    })

    // Check if the title is rendered
    expect(screen.getByText('Weather App')).toBeTruthy()

    // Check if the search form is rendered
    expect(screen.getByText('Current Weather')).toBeTruthy()
  })

  it('displays recent searches', async () => {
    render(HomeView, {
      global: {
        plugins: [router]
      }
    })

    // Check if recent searches are displayed
    expect(screen.getByText('Recent Searches')).toBeTruthy()
    expect(screen.getByText('Paris')).toBeTruthy()
    expect(screen.getByText('New York')).toBeTruthy()
  })
})
