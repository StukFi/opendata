<template>
  <div class="date-picker">
    <div class="controls">
      <h3>{{ pastDate }} -</h3>
      <button @click="prevDay">&lt;</button>
      <input v-model="formattedDate" type="date" @change="handleDateChange">
      <button @click="nextDay">&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    initialDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      selectedDate: this.initialDate
    };
  },
  computed: {
    formattedDate() {
      return this.selectedDate ? this.selectedDate.toISOString().substr(0, 10) : ''
    },
    pastDate() {
      const past = new Date(this.selectedDate)
      past.setDate(past.getDate() - 30)
      return past.toISOString().substr(0, 10)
    }
  },
  watch: {
    initialDate(newValue) {
      this.selectedDate = newValue
    }
  },
  methods: {
    handleDateChange(event) {
      const newDate = new Date(event.target.value)
      this.selectedDate = newDate
      this.$emit("dateChanged", newDate)
    },
    prevDay() {
      const currentDay = new Date(this.selectedDate)
      currentDay.setDate(currentDay.getDate() - 1)
      this.selectedDate = currentDay
      this.$emit("dateChanged", currentDay)
    },
    nextDay() {
      const currentDay = new Date(this.selectedDate)
      currentDay.setDate(currentDay.getDate() + 1)
      this.selectedDate = currentDay
      this.$emit("dateChanged", currentDay)
    },
  }
}
</script>

<style scoped>
.date-picker {
  text-align: center;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.controls button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  padding: 0.5em;
}

.controls input[type="date"] {
  font-size: 1em;
  padding: 0.5em;
  text-align: center;
  width: 180px;
}

.past-date {
  margin-top: 1em;
  font-size: 1em;
}

h3 {
  color: black;
}
</style>