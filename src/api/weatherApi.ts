import axios from 'axios'
import type { WeatherData, ForecastData } from '../types/weather'

// OpenWeatherMap API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Create axios instance with common configuration
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric' // Use metric units (Celsius)
  }
})

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get<WeatherData>('/weather', {
      params: { q: city }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await weatherApi.get<ForecastData>('/forecast', {
      params: { q: city }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching forecast data:', error)
    throw error
  }
}

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get<WeatherData>('/weather', {
      params: { lat, lon }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error)
    throw error
  }
}

export default weatherApi
