# Weather App

A responsive, single-page application (SPA) for checking weather conditions using the OpenWeatherMap API.

## Features

- Search for weather by city name
- Get weather for your current location using the Geolocation API
- View current weather conditions and 5-day forecast
- Responsive design that works on desktop and mobile devices
- Dark mode support based on system preferences
- Recent searches history

## Technologies Used

- Vue.js 3 with Composition API
- TypeScript for type safety
- Vue Router for navigation
- Pinia for state management
- Axios for API requests
- SCSS for styling
- Geolocation Web API

## Project Structure

The project follows Atomic Design principles for component organization:

- **atoms**: Basic building blocks (Button, Input)
- **molecules**: Groups of atoms (SearchForm, LocationWeather)
- **organisms**: Complex UI sections (WeatherCard, ForecastList, WeatherDetail)
- **views**: Full pages (HomeView, WeatherDetailView)

Other directories:
- **api**: API service for OpenWeatherMap
- **router**: Vue Router configuration
- **store**: Pinia store for state management
- **types**: TypeScript interfaces and types

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Create a `.env` file in the root directory with your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
5. Build for production:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

## Accessibility Features

- Semantic HTML elements
- ARIA attributes for screen readers
- Keyboard navigation support
- Color contrast that meets WCAG guidelines
- Responsive design for all device sizes

## Performance Optimizations

- Lazy loading of route components
- Caching of API responses
- Optimized images and assets
- Minimized re-renders using computed properties

## License

MIT
