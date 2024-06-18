import { shallowMount } from "@vue/test-utils"
import { describe, it, beforeEach, expect } from "vitest"
import Timepicker from "./Timepicker"

describe("Timepicker.vue", () => {
  let wrapper
  const selectedTime = "12:00"

  beforeEach(() => {
    wrapper = shallowMount(Timepicker, {
      computed: {
        formattedTime: () => selectedTime
      }
    })
  })

  it("renders the currently selected time", () => {
    expect(wrapper.text()).toContain(selectedTime)
  })
})