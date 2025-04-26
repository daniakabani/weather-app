<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Input from '../components/atoms/Input.vue'
import Button from '../components/atoms/Button.vue'

const router = useRouter()
const searchQuery = ref('')
const suggestions = ref<Array<{ place_id: string; description: string }>>([])
const isLoading = ref(false)
const error = ref<string | undefined>(undefined)
const searchInputRef = ref<HTMLInputElement | null>(null)

// Auto-focus the input field when the component is mounted
onMounted(() => {
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
})

// Function to fetch place suggestions from Google Places API
const fetchSuggestions = async (query: string) => {
  if (!query.trim()) {
    suggestions.value = []
    return
  }

  try {
    isLoading.value = true
    error.value = undefined

    // In a real app, this would be an actual API call to Google Places Autocomplete API
    // For this demo, we'll simulate the API response
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay

    // Simulate API response with mock data
    const mockSuggestions = [
      { place_id: '1', description: `${query}` },
      { place_id: '2', description: `${query} Town, State, Country` },
      { place_id: '3', description: `${query} Village, Region, Country` },
      { place_id: '4', description: `New ${query}, Country` },
      { place_id: '5', description: `${query} Metropolitan Area, Country` }
    ]

    suggestions.value = mockSuggestions
    isLoading.value = false
  } catch (err) {
    console.error('Error fetching suggestions:', err)
    error.value = 'Failed to fetch location suggestions'
    isLoading.value = false
  }
}

// Debounce function to limit API calls
let debounceTimeout: number | null = null
const debouncedFetchSuggestions = (query: string) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = window.setTimeout(() => {
    fetchSuggestions(query)
  }, 300)
}

// Watch for changes in the search query
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  debouncedFetchSuggestions(searchQuery.value)
}

// Handle suggestion selection
const selectSuggestion = (suggestion: { place_id: string; description: string }) => {
  const cityName = suggestion.description.split(',')[0].trim()
  router.push({ name: 'WeatherDetail', params: { city: cityName } })
}

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a location'
    return
  }

  const cityName = searchQuery.value.trim()
  router.push({ name: 'WeatherDetail', params: { city: cityName } })
}

// Go back to home
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="search-view">
    <div class="search-header">
      <button class="back-button" @click="goBack" aria-label="Go back to home">
        <span class="chevron-left">&#8249;</span>
      </button>
      <h1>Search Location</h1>
    </div>

    <form @submit="handleSubmit" class="search-form">
      <div class="search-input-container">
        <Input
          v-model="searchQuery"
          placeholder="Enter city or location"
          label="Location"
          required
          :error="error"
          @input="handleSearchInput"
          ref="searchInputRef"
        />
        <Button type="submit" variant="primary" class="search-button">
          Search
        </Button>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <p>Loading suggestions...</p>
      </div>

      <div v-else-if="suggestions.length > 0" class="suggestions-container">
        <ul class="suggestions-list">
          <li
            v-for="suggestion in suggestions"
            :key="suggestion.place_id"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.description }}
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.search-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    flex-grow: 1;
  }
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  margin-right: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: darken(#4caf50, 10%);
  }

  .chevron-left {
    font-size: 1.5rem;
    line-height: 1;
  }
}

.search-form {
  width: 100%;
}

.search-input-container {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.search-button {
  align-self: flex-end;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0.5rem;
  }
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: var(--text-color);
}

.suggestions-container {
  margin-top: 1rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
}
</style>
