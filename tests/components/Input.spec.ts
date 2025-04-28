import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import Input from '../../src/components/atoms/Input.vue'

describe('Input Component', () => {
  it('renders correctly with label and placeholder', () => {
    render(Input, {
      props: {
        modelValue: '',
        label: 'Test Label',
        placeholder: 'Test Placeholder'
      }
    })

    // Check if the label is rendered
    expect(screen.getByText('Test Label')).toBeTruthy()

    // Check if the input has the correct placeholder
    const input = screen.getByPlaceholderText('Test Placeholder')
    expect(input).toBeTruthy()
  })

  it('emits update:modelValue event when input value changes', async () => {
    const { emitted } = render(Input, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    })

    // Find the input element
    const input = screen.getByLabelText('Test Label')

    // Type in the input
    await fireEvent.update(input, 'New Value')

    // Check if the update:modelValue event was emitted with the correct value
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['New Value'])
  })

  it('displays error message when error prop is provided', () => {
    render(Input, {
      props: {
        modelValue: '',
        label: 'Test Label',
        error: 'This is an error message'
      }
    })

    // Check if the error message is displayed
    expect(screen.getByText('This is an error message')).toBeTruthy()
  })

  it('applies disabled attribute when disabled prop is true', () => {
    render(Input, {
      props: {
        modelValue: '',
        label: 'Test Label',
        disabled: true
      }
    })

    // Find the input element
    const input = screen.getByLabelText('Test Label') as HTMLInputElement

    // Check if the disabled attribute is applied
    expect(input.disabled).toBe(true)
  })
})
