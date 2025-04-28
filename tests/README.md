# Weather App Tests

This directory contains tests for the Weather App. The tests are written using Vitest and @testing-library/vue.

## Test Structure

The tests are organized by component type:

- `components/`: Tests for UI components
- `views/`: Tests for view components
- `store/`: Tests for Pinia stores
- `layouts/`: Tests for layout components
- `App.spec.ts`: Tests for the root App component

## Running Tests

To run the tests, use the following commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The tests cover the following functionality:

### UI Components
- Rendering of components
- User interactions (clicks, input)
- Component state changes

### Views
- HomeView: Rendering, recent searches, weather cards
- SearchView: Rendering, navigation, search functionality
- WeatherDetailView: Rendering, add/delete location functionality

### Store
- Weather store: Caching, adding/removing locations, fetching data

### Layout
- MainLayout: Rendering, navigation, dark mode support

### App
- Root component rendering
- Layout structure

## Adding New Tests

When adding new tests, follow these guidelines:

1. Place tests in the appropriate directory based on the component type
2. Use descriptive test names that explain what is being tested
3. Mock external dependencies (API calls, router, etc.)
4. Test both success and failure scenarios
5. Test user interactions and UI updates

## Testing Dark Mode

Some tests include checks for dark mode support. Since CSS variables can't be easily tested in JSDOM, these tests focus on ensuring the components render correctly when dark mode is enabled.
