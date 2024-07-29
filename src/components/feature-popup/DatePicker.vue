<template>
  <div class="date-picker">
    <div class="controls">
      <p>{{ formatDates(pastDate) }} -</p>
      <button @click="prevDay">&lt;</button>
      <vue-date-picker
        v-model="selectedDate"
        @date-update="handleDateChange"
        :locale="language"
        :format="formatDates"
        auto-apply
        :enable-time-picker="false"
        :max-date="new Date()"
        hide-input-icon

      />
      <button @click="nextDay" :class="{ disabled: isToday }">&gt;</button>
    </div>
  </div>
</template>


<script>
import VueDatePicker from "@vuepic/vue-datepicker"
import '@vuepic/vue-datepicker/dist/main.css'
import eventBus from "@/utils/eventBus"

export default {
  name: "DatePicker",
  emits: ["dateChanged"],
  components: {
    VueDatePicker
  },
  data() {
    return {
      selectedDate: new Date(),
      fi: "fi",
      en: "en",
    }
  },
  computed: {
    language() {
      switch (this.$store.state.settings.settings.locale) {
        case "en":
        default:
          return this.en
        case "fi":
          return this.fi
      }
    },
    pastDate() {
      const past = new Date(this.selectedDate)
      past.setDate(past.getDate() - 30)
      return past
    },
    isToday() {
      const today = new Date()
      return (
        this.selectedDate.getDate() === today.getDate() &&
        this.selectedDate.getMonth() === today.getMonth() &&
        this.selectedDate.getFullYear() === today.getFullYear()
      )
    },
    mode() {
      return this.$store.state.settings.settings.mode
    },
  },
  mounted() {
    eventBus.$on("featureClicked", this.resetDate)
  },
  methods: {
    formatDates(date) {
    switch (this.$store.state.settings.settings.dateFormat) {
      case "fi":
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
      case "iso":
      default:
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    }
    },
    resetDate() { // Reset the date when opening a new feature
      if (this.mode == "air_radionuclides") {
      this.selectedDate = new Date()
      }
    },
    handleDateChange(newDate) {
      this.selectedDate = new Date(newDate)
      eventBus.$emit("dateChanged", this.selectedDate)
    },
    prevDay() {
      const currentDay = new Date(this.selectedDate)
      currentDay.setDate(currentDay.getDate() - 1)
      this.selectedDate = currentDay

      eventBus.$emit("dateChanged", this.selectedDate)
    },
    nextDay() {
      const currentDay = new Date(this.selectedDate)
      if (this.isToday) {
        return
      }
      currentDay.setDate(currentDay.getDate() + 1)
      this.selectedDate = currentDay
      eventBus.$emit("dateChanged", this.selectedDate)
    }
  }
}
</script>

<style>
.date-picker {
  text-align: center;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3em;
  font-family: "RedHatText-Medium";
  font-size: 1.2em;
  margin-top: 0.105em;
  
}

.controls button.disabled {
  cursor: not-allowed;
  color: gray;
}

.dp__main, .dp__theme_light {
  text-align: center;
  width: 8em;
  font-family: "RedHatText-Medium";
  font-size: 0.9em;
}

.dp__input, .dp__input_reg {
  font-size: 1.2em;
  text-align: center;
  width: 8em;
  font-family: "RedHatText-Medium";
  font-size: 1em;
  padding-right: 1em;
  padding-left: 1em;
}

.dp__input_wrap {
  width: 8em;
}

.dp__clear_icon {
    display: none;
}

.past-date {
  margin-top: 1em;
  font-size: 1em;
}

.controls p {
  width: 6.4em;
  text-align: center;
  color: black;
}

</style>