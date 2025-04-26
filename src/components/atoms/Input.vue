<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  label?: string
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`)
const inputRef = ref<HTMLInputElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

defineExpose({
  focus: () => inputRef.value?.focus()
})

</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <input
      :id="inputId"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      :disabled="disabled"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      class="input-field"
      :class="{ 'has-error': !!error }"
      @input="handleInput"
    />

    <div v-if="error" :id="`${inputId}-error`" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;

  .required-indicator {
    color: #f44336;
    margin-left: 0.25rem;
  }
}

.input-field {
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.25);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &.has-error {
    border-color: #f44336;

    &:focus {
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.25);
    }
  }
}

.error-message {
  font-size: 0.75rem;
  color: #f44336;
  margin-top: 0.25rem;
}
</style>
