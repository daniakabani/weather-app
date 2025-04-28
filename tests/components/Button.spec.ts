import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import Button from '../../src/components/atoms/Button.vue'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(Button, {
      slots: {
        default: 'Click Me'
      }
    })

    // Check if the button is rendered with the correct text
    const button = screen.getByText('Click Me') as HTMLButtonElement
    expect(button).toBeTruthy()
    expect(button.tagName).toBe('BUTTON')

    // Check default type is 'button'
    expect(button.type).toBe('button')
  })

  it('applies the correct type attribute', () => {
    render(Button, {
      props: {
        type: 'submit'
      },
      slots: {
        default: 'Submit'
      }
    })

    // Check if the button has the correct type
    const button = screen.getByText('Submit') as HTMLButtonElement
    expect(button.type).toBe('submit')
  })

  it('applies the disabled attribute when disabled prop is true', () => {
    render(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })

    // Check if the button is disabled
    const button = screen.getByText('Disabled Button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const { emitted } = render(Button, {
      slots: {
        default: 'Click Me'
      }
    })

    // Find and click the button
    const button = screen.getByText('Click Me')
    await fireEvent.click(button)

    // Check if the click event was emitted
    expect(emitted().click).toBeTruthy()
  })

})
