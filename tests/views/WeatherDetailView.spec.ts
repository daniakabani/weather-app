import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import WeatherDetailView from '../../src/views/WeatherDetailView.vue'
import { useWeatherStore } from '../../src/store/weather'

// Mock the WeatherDetail component
vi.mock('../../src/components/organisms/WeatherDetail.vue', () => ({
  default: {
    props: ['city'],
    template: '<div data-testid="weather-detail">Weather details for {{ city }}</div>'
  }
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    },
    {
      path: '/weather/:city',
      name: 'WeatherDetail',
      component: WeatherDetailView,
      props: true
    }
  ]
})

// Mock router.push
const mockRouterPush = vi.fn()
router.push = mockRouterPush

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

describe('WeatherDetailView', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)

    // Mock the weather store
    const weatherStore = useWeatherStore()

    // Mock the fetchWeatherForLocation method
    weatherStore.fetchWeatherForLocation = vi.fn().mockResolvedValue({
      weather: mockWeatherData,
      forecast: null,
      timestamp: Date.now()
    })

    // Mock the fetchWeatherDataOnly method
    weatherStore.fetchWeatherDataOnly = vi.fn().mockResolvedValue({
      weather: mockWeatherData,
      forecast: null
    })

    // Mock the removeLocation method
    weatherStore.removeLocation = vi.fn().mockReturnValue(true)

    // Mock the addLocation method
    weatherStore.addLocation = vi.fn().mockResolvedValue(true)

    // Set up mock data
    weatherStore.locationWeathers = {
      'London': {
        weather: mockWeatherData,
        forecast: null,
        timestamp: Date.now()
      }
    }

    // Clear all mocks
    vi.clearAllMocks()
  })

  it('shows delete button when location exists in store', async () => {
    // Set the route params
    router.currentRoute.value.params = { city: 'London' }

    render(WeatherDetailView, {
      global: {
        plugins: [router]
      }
    })

    // Check if the delete button is rendered
    expect(screen.getByLabelText('Delete location')).toBeTruthy()
  })

  it('shows add button when location does not exist in store', async () => {
    // Set the route params
    router.currentRoute.value.params = { city: 'Paris' }

    // Update the weather store to not include Paris
    const weatherStore = useWeatherStore()
    weatherStore.locationWeathers = {
      'London': {
        weather: mockWeatherData,
        forecast: null,
        timestamp: Date.now()
      }
    }

    render(WeatherDetailView, {
      global: {
        plugins: [router]
      }
    })

    // Check if the add button is rendered
    expect(screen.getByLabelText('Add location')).toBeTruthy()
  })

  it('navigates back when back button is clicked', async () => {
    // Set the route params
    router.currentRoute.value.params = { city: 'London' }

    render(WeatherDetailView, {
      global: {
        plugins: [router]
      }
    })

    // Find and click the back button
    const backButton = screen.getByLabelText('Go back to home')
    await fireEvent.click(backButton)

    // Check if router.push was called with the correct path
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})
