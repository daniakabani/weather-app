<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import Button from '../components/atoms/Button.vue'
import Input from '../components/atoms/Input.vue'

const router = useRouter()
const userStore = useUserStore()
const profile = computed(() => userStore.profile)
const isEditing = computed(() => userStore.isEditing)
const isLoading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)


const goBack = () => {
  router.push('/')
}

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const resetFormData = () => {
  formData.value = {
    firstName: profile.value.firstName,
    lastName: profile.value.lastName,
    email: profile.value.email,
    phone: profile.value.phone,
  }
}
resetFormData()

// Form validation
const formErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const isFormValid = computed(() => {
  return !formErrors.value.firstName &&
         !formErrors.value.lastName &&
         !formErrors.value.email &&
         !formErrors.value.phone
})

const validateForm = () => {
  // Reset errors
  formErrors.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }

  // Validate first name
  if (!formData.value.firstName.trim()) {
    formErrors.value.firstName = 'First name is required'
  }

  // Validate last name
  if (!formData.value.lastName.trim()) {
    formErrors.value.lastName = 'Last name is required'
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    formErrors.value.email = 'Email is required'
  } else if (!emailRegex.test(formData.value.email)) {
    formErrors.value.email = 'Please enter a valid email address'
  }

  // Validate phone
  const phoneRegex = /^\d{10,15}$/  // Accepts numbers between 10 and 15 digits
  if (!formData.value.phone.trim()) {
    formErrors.value.phone = 'Phone number is required'
  } else if (!phoneRegex.test(formData.value.phone)) {
    formErrors.value.phone = 'Please enter a valid phone number (10-15 digits)'
  }

  return isFormValid.value
}

const handleEditToggle = async () => {
  if (isEditing.value) {
    // If currently editing, validate and submit
    if (validateForm()) {
      await userStore.updateProfile({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phone: formData.value.phone,
      })
      console.error('Failed to update profile')
    }
  } else {
    // If not editing, enter edit mode and reset form data
    resetFormData() // Reset form data to current profile values
    userStore.toggleEditMode()
  }
}

const handleCancel = () => {
  resetFormData() // Reset form data to original values
  userStore.toggleEditMode()
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-header">
      <button class="back-button" @click="goBack" aria-label="Go back to home">
        <span class="chevron-left">&#8249;</span>
      </button>
      <h1>User Profile</h1>
    </div>

    <div class="profile-container">
      <div class="profile-user-header">
        <div class="profile-picture">
          <img :src="profile.profilePicture" alt="Profile Picture" />
        </div>

        <div class="profile-info">
          <h2>{{ userStore.fullName }}</h2>
          <p class="info-item">
            <span class="info-label">Email:</span> {{ profile.email }}
          </p>
          <p class="info-item">
            <span class="info-label">Phone:</span> {{ userStore.formattedPhone }}
          </p>
        </div>
      </div>

      <div class="profile-form">
        <h3>Profile Information</h3>

        <form @submit.prevent="handleEditToggle">
          <div class="form-row">
            <Input
              v-model="formData.firstName"
              label="First Name"
              :disabled="!isEditing"
              :error="formErrors.firstName"
              required
            />
          </div>

          <div class="form-row">
            <Input
              v-model="formData.lastName"
              label="Last Name"
              :disabled="!isEditing"
              :error="formErrors.lastName"
              required
            />
          </div>

          <div class="form-row">
            <Input
              v-model="formData.email"
              type="email"
              label="Email"
              :disabled="!isEditing"
              :error="formErrors.email"
              required
            />
          </div>

          <div class="form-row phone-row">
            <div class="phone-input">
              <Input
                v-model="formData.phone"
                label="Phone Number"
                :disabled="!isEditing"
                :error="formErrors.phone"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <Button
              type="submit"
              :variant="isEditing ? 'primary' : 'secondary'"
              :disabled="isLoading"
            >
              {{ isEditing ? 'Submit' : 'Edit' }}
            </Button>

            <Button
              v-if="isEditing"
              type="button"
              variant="outline"
              :disabled="isLoading"
              @click="handleCancel"
            >
              Cancel
            </Button>
          </div>

          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="isLoading" class="loading-message">Updating profile...</p>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
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

.profile-container {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-user-header {
  display: flex;
  padding: 2rem;
  background-color: var(--primary-color);
  color: white;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-info {
  margin-left: 2rem;

  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 1rem;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.75rem;
  }

  .info-item {
    margin: 0.5rem 0;
    font-size: 1rem;

    .info-label {
      font-weight: 600;
      margin-right: 0.5rem;
    }
  }
}

.profile-form {
  padding: 2rem;

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: var(--text-color);
  }
}

.form-row {
  margin-bottom: 1.5rem;
}

.phone-row {
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .phone-input {
    flex: 1;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.error-message {
  color: var(--error-color);
  margin-top: 1rem;
}

.loading-message {
  color: var(--primary-color);
  margin-top: 1rem;
}
</style>
