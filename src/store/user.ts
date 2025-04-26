import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  profilePicture: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const profile = ref<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
    countryCode: '+1',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
  })
  const isEditing = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const fullName = computed(() => {
    return `${profile.value.firstName} ${profile.value.lastName}`
  })

  const formattedPhone = computed(() => {
    return `${profile.value.countryCode} ${profile.value.phone}`
  })

  // Actions
  function toggleEditMode() {
    isEditing.value = !isEditing.value
  }

  async function updateProfile(updatedProfile: Partial<UserProfile>) {
    try {
      isLoading.value = true
      error.value = null

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update profile with new data
      profile.value = {
        ...profile.value,
        ...updatedProfile
      }

      // Exit edit mode
      isEditing.value = false
      isLoading.value = false
    } catch (err) {
      console.error('Error updating profile:', err)
      error.value = 'Failed to update profile. Please try again.'
      isLoading.value = false
    }
  }

  return {
    // State
    profile,
    isEditing,
    isLoading,
    error,

    // Getters
    fullName,
    formattedPhone,

    // Actions
    toggleEditMode,
    updateProfile
  }
})
