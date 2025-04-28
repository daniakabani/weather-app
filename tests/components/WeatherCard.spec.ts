import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { WEATHER_RESPONSE, FORECAST_RESPONSE } from './mocked.data'
import WeatherCard from '../../src/components/molecules/WeatherCard.vue'

describe('WeatherCard Component', () => {
  it('renders correctly with weather data', () => {
    render(WeatherCard, {
      props: {
        weather: WEATHER_RESPONSE
      }
    })

    // Check if the city name is rendered
    expect(screen.getByText('London, GB')).toBeTruthy()

    // Check if the temperature is rendered
    expect(screen.getByText('13°C')).toBeTruthy()

    // Check if the weather description is rendered
    expect(screen.getByText('overcast clouds')).toBeTruthy()
  })

  it('renders temperature range correctly', () => {
    render(WeatherCard, {
      props: {
        weather: WEATHER_RESPONSE
      }
    })

    // Check if the min and max temperatures are rendered
    expect(screen.getByText("19°C")).toBeTruthy()
    expect(screen.getByText("17°C")).toBeTruthy()
  })

  it('renders weather icon correctly', () => {
    render(WeatherCard, {
      props: {
        weather: WEATHER_RESPONSE
      }
    })

    // Check if the weather icon is rendered
    const weatherIcon = screen.getByAltText('overcast clouds')
    expect(weatherIcon).toBeTruthy()
    expect(weatherIcon.getAttribute('src')).toContain('04d')
  })
})
