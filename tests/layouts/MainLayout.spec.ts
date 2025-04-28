import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import MainLayout from '../../src/layouts/MainLayout.vue'
import { useUserStore } from '../../src/store/user'

// Mock the user store
vi.mock('../../src/store/user', () => ({
  useUserStore: vi.fn(() => ({
    fullName: 'John Doe',
    profile: {
      profilePicture: 'profile.jpg'
    }
  }))
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
      path: '/profile',
      name: 'Profile',
      component: { template: '<div>Profile</div>' }
    }
  ]
})

// Mock router.push
const mockRouterPush = vi.fn()
router.push = mockRouterPush

describe('MainLayout', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)

    // Clear all mocks
    vi.clearAllMocks()
  })

  it('renders the layout correctly', () => {
    render(MainLayout, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      },
      slots: {
        default: '<div data-testid="content">Content</div>'
      }
    })

    // Check if the header is rendered
    expect(screen.getByText('Weather App')).toBeTruthy()

    // Check if the user name is rendered
    expect(screen.getByText('John Doe')).toBeTruthy()

    // Check if the content slot is rendered
    expect(screen.getByTestId('content')).toBeTruthy()
    expect(screen.getByText('Content')).toBeTruthy()

    // Check if the footer is rendered
    expect(screen.getByText(/Weather App. Powered by OpenWeatherMap/)).toBeTruthy()
  })

  it('navigates to profile when profile section is clicked', async () => {
    render(MainLayout, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      },
      slots: {
        default: '<div>Content</div>'
      }
    })

    // Find and click the profile section
    const profileSection = screen.getByText('John Doe').closest('div')
    await profileSection.click()

    // Check if router.push was called with the correct path
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Profile' })
  })

  it('renders the layout with dark mode styles when preferred', () => {
    // Mock the matchMedia to simulate dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => {
      return {
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    })

    render(MainLayout, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      },
      slots: {
        default: '<div>Content</div>'
      }
    })

    // Check if the layout is rendered
    expect(screen.getByText('Weather App')).toBeTruthy()

    // Note: We can't easily test CSS variables in JSDOM, but we can check that the component renders
  })
})
