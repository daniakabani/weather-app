import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../src/App.vue'

// Mock the MainLayout component
vi.mock('../src/layouts/MainLayout.vue', () => ({
  default: {
    template: '<div data-testid="main-layout"><slot /></div>'
  }
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div data-testid="home-view">Home View</div>' }
    }
  ]
})

describe('App', () => {
  it('renders the main layout', () => {
    render(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view">Router View</div>'
          }
        }
      }
    })

    // Check if the main layout is rendered
    expect(screen.getByTestId('main-layout')).toBeTruthy()

    // Check if the router view is rendered
    expect(screen.getByTestId('router-view')).toBeTruthy()
  })

  it('applies CSS variables for light/dark mode', () => {
    // This test is more of a placeholder since we can't easily test CSS variables in JSDOM
    // In a real test, we might use a visual testing tool like Storybook or Cypress

    render(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: true
        }
      }
    })

    // Check if the app renders
    expect(screen.getByTestId('main-layout')).toBeTruthy()
  })
})
