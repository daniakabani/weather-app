import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWeatherStore } from '../../src/store/weather'
import { WEATHER_RESPONSE, FORECAST_RESPONSE } from '../components/mocked.data'
import * as weatherApi from '../../src/api/weatherApi'

// Mock the weather API
vi.mock('../../src/api/weatherApi', () => ({
  getWeatherByCity: vi.fn(),
  getForecastByCity: vi.fn(),
  getWeatherByCoordinates: vi.fn()
}))

describe('Weather Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)

    // Reset all mocks
    vi.resetAllMocks()

    // Mock the API responses
    vi.mocked(weatherApi.getWeatherByCity).mockResolvedValue(WEATHER_RESPONSE)
    vi.mocked(weatherApi.getForecastByCity).mockResolvedValue(FORECAST_RESPONSE)
    vi.mocked(weatherApi.getWeatherByCoordinates).mockResolvedValue(WEATHER_RESPONSE)
  })

  it('fetches weather data for a location', async () => {
    const store = useWeatherStore()

    // Fetch weather for London
    await store.fetchWeatherForLocation('London')

    // Check if the API was called
    expect(weatherApi.getWeatherByCity).toHaveBeenCalledWith('London')
    expect(weatherApi.getForecastByCity).toHaveBeenCalledWith('London')

    // Check if the data was stored
    expect(store.locationWeathers['London']).toBeDefined()
    expect(store.locationWeathers['London'].weather).toEqual(WEATHER_RESPONSE)
    expect(store.locationWeathers['London'].forecast).toEqual(FORECAST_RESPONSE)
  })

  it('uses cached data when available', async () => {
    const store = useWeatherStore()

    // Set up cached data
    store.locationWeathers = {
      'London': {
        weather: WEATHER_RESPONSE,
        forecast: FORECAST_RESPONSE,
        timestamp: Date.now()
      }
    }

    // Fetch weather for London
    await store.fetchWeatherForLocation('London')

    // Check that the API was not called
    expect(weatherApi.getWeatherByCity).not.toHaveBeenCalled()
    expect(weatherApi.getForecastByCity).not.toHaveBeenCalled()
  })

  it('adds a location to the store', async () => {
    const store = useWeatherStore()

    // Add London to the store
    await store.addLocation('London')

    // Check if the API was called
    expect(weatherApi.getWeatherByCity).toHaveBeenCalledWith('London')
    expect(weatherApi.getForecastByCity).toHaveBeenCalledWith('London')

    // Check if the data was stored
    expect(store.locationWeathers['London']).toBeDefined()
  })

  it('removes a location from the store', () => {
    const store = useWeatherStore()

    // Set up cached data
    store.locationWeathers = {
      'London': {
        weather: WEATHER_RESPONSE,
        forecast: FORECAST_RESPONSE,
        timestamp: Date.now()
      }
    }

    // Add London to recent searches
    store.recentSearches = ['London', 'Paris']

    // Remove London from the store
    const result = store.removeLocation('London')

    // Check if the operation was successful
    expect(result).toBe(true)

    // Check if the data was removed
    expect(store.locationWeathers['London']).toBeUndefined()

    // Check if it was removed from recent searches
    expect(store.recentSearches).not.toContain('London')
  })
})
