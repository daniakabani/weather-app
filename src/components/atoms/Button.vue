<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}>()

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="['btn', `btn-${variant || 'primary'}`]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &-primary {
    background-color: #4caf50;
    color: white;
    border: 1px solid #4caf50;

    &:hover:not(:disabled) {
      background-color: #45a049;
      border-color: #45a049;
    }
  }

  &-secondary {
    background-color: #2196f3;
    color: white;
    border: 1px solid #2196f3;

    &:hover:not(:disabled) {
      background-color: #0b7dda;
      border-color: #0b7dda;
    }
  }

  &-outline {
    background-color: transparent;
    color: #4caf50;
    border: 1px solid #4caf50;

    &:hover:not(:disabled) {
      background-color: rgba(76, 175, 80, 0.1);
    }
  }
}
</style>
