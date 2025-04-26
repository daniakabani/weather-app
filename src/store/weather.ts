import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getWeatherByCity, getForecastByCity, getWeatherByCoordinates } from '../api/weatherApi'
import type { WeatherData, ForecastData } from '../types/weather'

export interface LocationWeather {
  weather: WeatherData
  forecast: ForecastData | null
  timestamp: number
}

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref<WeatherData | null>(null)
  const forecast = ref<ForecastData | null>(null)
  const recentSearches = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const locationWeathers = ref<Record<string, LocationWeather>>({}) // Store for multiple locations

  // Getters
  const currentTemperature = computed(() => {
    return currentWeather.value?.main.temp
  })

  const weatherDescription = computed(() => {
    return currentWeather.value?.weather[0]?.description
  })

  const weatherIcon = computed(() => {
    const iconCode = currentWeather.value?.weather[0]?.icon
    return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null
  })

  const formattedForecast = computed(() => {
    if (!forecast.value) return []

    // Group forecast by day and return the first entry for each day
    const dailyForecasts = forecast.value.list.reduce(
      (acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = item
        }
        return acc
      },
      {} as Record<string, ForecastData['list'][0]>
    )

    return Object.values(dailyForecasts)
  })

  // Actions
  async function fetchWeatherByCoordinates(lat: number, lon: number) {
    if (!lat || !lon) return null

    try {
      isLoading.value = true
      error.value = null

      // Fetch weather by coordinates
      const weatherData = await getWeatherByCoordinates(lat, lon)
      currentWeather.value = weatherData

      // Also fetch forecast for the detected city
      if (weatherData.name) {
        // Check if we already have forecast data for this city
        if (locationWeathers.value[weatherData.name]?.forecast) {
          forecast.value = locationWeathers.value[weatherData.name].forecast
          console.log(`Using cached forecast data for ${weatherData.name}`)
        } else {
          const forecastData = await getForecastByCity(weatherData.name)
          forecast.value = forecastData

          // Store the data in locationWeathers for future use
          locationWeathers.value[weatherData.name] = {
            weather: weatherData,
            forecast: forecastData,
            timestamp: Date.now()
          }
        }

        // Add to recent searches if not already present
        if (!recentSearches.value.includes(weatherData.name)) {
          recentSearches.value.unshift(weatherData.name)
          // Keep only the 5 most recent searches
          if (recentSearches.value.length > 5) {
            recentSearches.value.pop()
          }
        }
      }

      isLoading.value = false
      return weatherData
    } catch (err) {
      isLoading.value = false
      error.value = 'Failed to fetch weather data. Please try again.'
      console.error('Error in fetchWeatherByCoordinates:', err)
      throw err
    }
  }

  async function fetchWeatherDataOnly(city: string) {
    if (!city) return null

    try {
      isLoading.value = true
      error.value = null

      // Fetch current weather and forecast in parallel
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ])

      currentWeather.value = weatherData
      forecast.value = forecastData

      // Add to recent searches if not already present
      if (!recentSearches.value.includes(city)) {
        recentSearches.value.unshift(city)
        if (recentSearches.value.length > 5) {
          recentSearches.value.pop()
        }
      }

      isLoading.value = false
      return { weather: weatherData, forecast: forecastData }
    } catch (err) {
      isLoading.value = false
      error.value = 'Failed to fetch weather data. Please try again.'
      console.error('Error in fetchWeatherDataOnly:', err)
      throw err
    }
  }

  // New actions for multiple locations
  async function fetchWeatherForLocation(city: string) {
    // First check store cache
    if (locationWeathers.value[city]) {
      const cachedData = locationWeathers.value[city]
      const cacheTime = cachedData.timestamp || 0
      // Use cache if less than 30 minutes old
      if (Date.now() - cacheTime < 30 * 60 * 1000) {
        console.log(`Using cached weather data for ${city}`)
        return cachedData
      }
    }

    try {
      // Check if we already have data for this city
      if (locationWeathers.value[city]) {
        console.log(`Using cached weather data for ${city}`)
        return locationWeathers.value[city]
      }

      // Fetch new data if not available
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ])

      const locationData = {
        weather: weatherData,
        forecast: forecastData || null,
        timestamp: Date.now()
      }

      locationWeathers.value[city] = locationData
      return locationData
    } catch (err) {
      console.error(`Error fetching weather for ${city}:`, err)
      throw err
    }
  }

  async function fetchWeatherForCurrentLocation() {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser')
    }

    return new Promise<LocationWeather>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords

            // First check if we have any cached location nearby
            const nearbyLocation = Object.values(locationWeathers.value).find((data) => {
              const coords = data.weather.coord
              if (!coords) return false

              // Check if coordinates are within ~1km radius and data is fresh
              const latDiff = Math.abs(coords.lat - latitude)
              const lonDiff = Math.abs(coords.lon - longitude)
              return (
                latDiff < 0.01 &&
                lonDiff < 0.01 &&
                Date.now() - (data.timestamp || 0) < 30 * 60 * 1000
              )
            })

            if (nearbyLocation) {
              // Update current weather and forecast from cache
              currentWeather.value = nearbyLocation.weather
              forecast.value = nearbyLocation.forecast
              resolve(nearbyLocation)
              return
            }

            // If no cached data found, fetch new data
            const weatherData = await getWeatherByCoordinates(latitude, longitude)

            // Check if we have this location cached by city name
            if (locationWeathers.value[weatherData.name]) {
              const cachedData = locationWeathers.value[weatherData.name]
              if (Date.now() - (cachedData.timestamp || 0) < 30 * 60 * 1000) {
                currentWeather.value = cachedData.weather
                forecast.value = cachedData.forecast
                resolve(cachedData)
                return
              }
            }

            // Fetch new forecast data
            const forecastData = await getForecastByCity(weatherData.name)

            // Create location data object
            const locationData = {
              weather: weatherData,
              forecast: forecastData,
              timestamp: Date.now()
            }

            // Update store
            locationWeathers.value[weatherData.name] = locationData
            currentWeather.value = weatherData
            forecast.value = forecastData

            // Add to recent searches if not already present
            if (!recentSearches.value.includes(weatherData.name)) {
              recentSearches.value.unshift(weatherData.name)
              if (recentSearches.value.length > 5) {
                recentSearches.value.pop()
              }
            }

            resolve(locationData)
          } catch (err) {
            console.error('Error getting weather for current location:', err)
            reject(err)
          }
        },
        (err) => {
          console.error('Geolocation error:', err)
          reject(err)
        },
        {
          enableHighAccuracy: false, // Save battery
          timeout: 10000,
          maximumAge: 5 * 60 * 1000 // Cache position for 5 minutes
        }
      )
    })
  }

  async function fetchInitialWeatherData() {
    isLoading.value = true
    error.value = null

    try {
      // Fetch weather for London and Paris
      const promises = [fetchWeatherForLocation('London'), fetchWeatherForLocation('Paris')]

      // Try to fetch weather for current location, but don't fail if it doesn't work
      try {
        promises.push(fetchWeatherForCurrentLocation())
      } catch (err) {
        console.error('Failed to get current location weather, continuing with other locations')
      }

      await Promise.allSettled(promises)
      isLoading.value = false
    } catch (err) {
      console.error('Error fetching initial weather data:', err)
      error.value = 'Failed to fetch some weather data'
      isLoading.value = false
    }
  }

  // Add a function to remove a location from locationWeathers
  function removeLocation(city: string) {
    console.log(`Removing location ${city} from store`)
    if (locationWeathers.value[city]) {
      console.log(locationWeathers.value)
      delete locationWeathers.value[city]

      // Also remove from recent searches if present
      const index = recentSearches.value.indexOf(city)
      if (index !== -1) {
        recentSearches.value.splice(index, 1)
      }

      return true
    }
    return false
  }

  // Add a function to add a location to locationWeathers
  async function addLocation(city: string) {
    if (!city) return false

    try {
      await fetchWeatherForLocation(city)
      return true
    } catch (err) {
      console.error(`Failed to add location ${city}:`, err)
      return false
    }
  }

  // Initialize store by loading from session storage

  return {
    // State
    currentWeather,
    forecast,
    recentSearches,
    isLoading,
    error,
    locationWeathers,

    // Getters
    currentTemperature,
    weatherDescription,
    weatherIcon,
    formattedForecast,

    // Actions
    fetchWeatherByCoordinates,
    fetchWeatherDataOnly,
    fetchWeatherForLocation,
    fetchInitialWeatherData,
    removeLocation,
    addLocation
  }
})
