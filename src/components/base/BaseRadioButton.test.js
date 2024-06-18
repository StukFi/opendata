import { describe, it, beforeEach, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRadioButton from './BaseRadioButton.vue'

describe('BaseRadioButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(BaseRadioButton, {
      props: {
        label: 'Option 1',
        ownValue: 'option1',
        modelValue: ''
      }
    })
  })

  it('renders a label prop', async () => {
    const label = 'Option 2';
    await wrapper.setProps({ label })
    expect(wrapper.find('.label').text()).toContain(label)
  })

  it('emits an update:modelValue event when its state changes', async () => {
    const radio = wrapper.find('input[type="radio"]')
    
    radio.element.checked = true
    await radio.trigger('change')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option1'])
  })
})
