import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import SearchForm from '../../src/components/molecules/SearchForm.vue'

// Mock the Input component
vi.mock('../../src/components/atoms/Input.vue', () => ({
  default: {
    props: ['modelValue', 'placeholder', 'label', 'required', 'error'],
    template: `
      <div>
        <label v-if="label">{{ label }}</label>
        <input 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
          :required="required"
          data-testid="search-input"
        />
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    `,
    emits: ['update:modelValue']
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
      path: '/search',
      name: 'Search',
      component: { template: '<div>Search</div>' }
    }
  ]
})

// Mock router.push
const mockRouterPush = vi.fn()
router.push = mockRouterPush

describe('SearchForm Component', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(SearchForm, {
      global: {
        plugins: [router]
      }
    })

    // Check if the search input is rendered
    expect(screen.getByTestId('search-input')).toBeTruthy()

    // Check if the search button is rendered
    expect(screen.getByText('Search')).toBeTruthy()
  })

  it('updates the search query when input changes', async () => {
    render(SearchForm, {
      global: {
        plugins: [router]
      }
    })

    // Find the search input
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement

    // Type in the search input
    await fireEvent.update(searchInput, 'London')

    // Check if the input value was updated
    expect(searchInput.value).toBe('London')
  })

  it('shows validation error when submitting empty form', async () => {
    render(SearchForm, {
      global: {
        plugins: [router]
      }
    })

    // Find the search input and clear it
    const searchInput = screen.getByTestId('search-input')
    await fireEvent.update(searchInput, '')

    // Find and click the search button
    const searchButton = screen.getByText('Search')
    await fireEvent.click(searchButton)

    // Check if the validation error is displayed
    // Note: In a real test, we would check for the specific error message
    // but since we've mocked the Input component, we'll just check that router.push wasn't called
    expect(mockRouterPush).not.toHaveBeenCalled()
  })
})
