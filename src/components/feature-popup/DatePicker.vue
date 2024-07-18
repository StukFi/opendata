<template>
  <div class="date-picker">
    <div class="controls">
      <button @click="prevMonth">&lt;</button>
      <input v-model="formattedDate" type="date" @change="handleDateChange">
      <button @click="nextMonth">&gt;</button>
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
    prevMonth() {
      const currentMonth = new Date(this.selectedDate)
      currentMonth.setMonth(currentMonth.getMonth() - 1)
      this.selectedDate = currentMonth
      this.$emit("dateChanged", currentMonth)
    },
    nextMonth() {
      const currentMonth = new Date(this.selectedDate)
      currentMonth.setMonth(currentMonth.getMonth() + 1)
      this.selectedDate = currentMonth
      this.$emit("dateChanged", currentMonth)
    }
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
  width: 130px;
}
</style>
